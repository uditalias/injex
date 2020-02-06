import { ModuleName, IModule, IContainerConfig, IDefinitionMetadata, IBootstrap, IInjexPlugin, IInjextHooks, Constructor } from "./interfaces";
import { EMPTY_ARGS, UNDEFINED, bootstrapSymbol } from "./constants";
import { getAllFilesInDir, isFunction } from "./utils/utils";
import { getMetadata, hasMetadata } from "./utils/metadata";
import { Logger } from "./utils/logger";
import { DuplicateDefinitionError, InitializeMuduleError, ModuleDependencyNotFoundError, InvalidPluginError } from "./errors";
import { SyncHook } from "tapable";
import createConfig from "./createConfig";

export default class InjexContainer {

	private moduleRegistry: Map<ModuleName, any>;
	private modules: Map<ModuleName, IModule>;
	public hooks: IInjextHooks;

	public static create(config: IContainerConfig): InjexContainer {

		config = createConfig(config);

		return new InjexContainer(
			config,
			new Logger(config.logLevel, config.logNamespace)
		);
	}

	private constructor(private config: IContainerConfig, public logger: Logger) {
		this.moduleRegistry = new Map<string, any>();
		this.modules = new Map<string, IModule>();

		this.createHooks();

		this.initPlugins();

		this.logger.debug("Container created with config", this.config);
	}

	public async bootstrap(): Promise<InjexContainer> {

		this.loadProjectFiles();

		this.createModules();

		await this.initializeModules();

		const bootstrapModule = this.get<IBootstrap>(bootstrapSymbol);

		if (bootstrapModule) {
			await bootstrapModule.run();
		}

		return this;
	}

	private initPlugins() {
		if (!this.config.plugins || !this.config.plugins.length) {
			return;
		}

		for (const plugin of this.config.plugins) {
			this.throwIfInvalidPlugin(plugin);
			plugin.apply(this);
		}
	}

	private createHooks() {
		this.hooks = {} as IInjextHooks;

		this.hooks.beforeRegistration = new SyncHook();
		this.hooks.afterRegistration = new SyncHook();
		this.hooks.beforeCreateModules = new SyncHook();
		this.hooks.afterCreateModules = new SyncHook();
		this.hooks.beforeModuleRequire = new SyncHook<string>(["filePath"]);
		this.hooks.afterModuleRequire = new SyncHook<string, any>(["filePath", "module"]);
		this.hooks.berforeCreateInstance = new SyncHook<Constructor, any[]>(["construct", "args"]);
	}

	private loadProjectFiles() {

		this.hooks.beforeRegistration.call();

		this.config.rootDirs

			// find all js files in the root directories
			.map((dir) => getAllFilesInDir(dir, this.config.globPattern))

			// flat into single array of files
			.reduce((allFiles: string[], files: string[]) => allFiles.concat(files), [])

			// require each file and register its module exports.
			.forEach((filePath) => {

				this.hooks.beforeModuleRequire.call(filePath);

				const moduleExports = require(filePath);

				this.hooks.afterModuleRequire.call(filePath, moduleExports);

				for (const key of Reflect.ownKeys(moduleExports)) {
					this.register(
						moduleExports[key]
					);
				}
			});

		this.hooks.afterRegistration.call();
	}

	private throwIfAlreadyDefined(name: ModuleName) {
		if (this.moduleRegistry.has(name)) {
			throw new DuplicateDefinitionError(name);
		}
	}

	private throwIfModuleExists(name: ModuleName) {
		if (this.modules.has(name)) {
			throw new DuplicateDefinitionError(name);
		}
	}

	private throwIfInvalidPlugin(plugin: IInjexPlugin) {
		if (!plugin.apply || !isFunction(plugin.apply)) {
			throw new InvalidPluginError(plugin);
		}
	}

	private createModules() {

		this.hooks.beforeCreateModules.call();

		this.moduleRegistry.forEach((item) => {

			const metadata = getMetadata(item);

			this.throwIfModuleExists(metadata.name);

			const module = metadata.singleton
				? this.createInstance(item, EMPTY_ARGS)
				: this.createModuleFactoryMethod(item, metadata);

			this.modules.set(metadata.name, { module, metadata });
		});

		this.hooks.afterCreateModules.call();
	}

	private createModuleFactoryMethod(construct: Constructor, metadata: IDefinitionMetadata): (...args) => Promise<void> {
		const self = this;

		return async function factory(...args): Promise<void> {
			const instance = self.createInstance(construct, args);
			self.injectModuleDependencies(instance, metadata);
			await self.invokeModuleInitMethod(instance, metadata);
			return instance;
		}
	}

	private async initializeModules(): Promise<void> {
		await Promise.all(
			Array
				.from(this.modules.values())
				.map(async ({ module, metadata }) => {
					if (metadata && metadata.singleton) {
						this.injectModuleDependencies(module, metadata);
						return this.invokeModuleInitMethod(module, metadata);
					}
				})
		);
	}

	private async invokeModuleInitMethod(module: any, metadata: IDefinitionMetadata): Promise<void> {
		if (metadata.initMethod && isFunction(module[metadata.initMethod])) {
			try {
				await module[metadata.initMethod]();
			} catch (e) {
				throw new InitializeMuduleError(metadata.name);
			}
		}
	}

	private createInstance(construct: any, args: any[]): any {

		this.hooks.berforeCreateInstance.call(construct, args);

		return Reflect.construct(construct, args);
	}

	private injectModuleDependencies(module: any, metadata: IDefinitionMetadata) {
		const dependencies = metadata.dependencies || [];

		for (const { label, value } of dependencies) {

			let dependency;

			if (this.modules.has(value)) {
				dependency = this.modules.get(value).module;
			} else if (value instanceof Function) {
				metadata = getMetadata(value);
				dependency = this.modules.get(metadata.name).module;
			}

			if (!dependency) {
				throw new ModuleDependencyNotFoundError(metadata.name, value);
			}

			module[label] = dependency;
		}
	}

	private register(item: any) {
		if (!item || !hasMetadata(item)) {
			return;
		}

		const metadata = getMetadata(item);

		this.throwIfAlreadyDefined(metadata.name);

		this.moduleRegistry.set(metadata.name, item);
	}

	/**
	 * Manually add object to the container as singleton
	 *
	 * @param obj - Object to add
	 * @param name - Name of the object
	 */
	public addObject(obj: any, name: string): InjexContainer {

		this.throwIfModuleExists(name);

		const metadata = { singleton: true, item: obj, name };

		this.modules.set(name, { module: obj, metadata });

		return this;
	}

	/**
	 * Remove object from container
	 *
	 * @param name - Name of the object
	 */
	public removeObject(name: string): InjexContainer {
		this.modules.delete(name);
		this.moduleRegistry.delete(name);

		return this;
	}

	public get<T = any>(itemNameOrType: any): T {
		if (!this.modules.has(itemNameOrType)) {
			return UNDEFINED;
		}

		const {
			module
		} = this.modules.get(itemNameOrType);

		return module;
	}
}