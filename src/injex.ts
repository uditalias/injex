import { IModule, IContainerConfig, IDefinitionMetadata, IBootstrap } from "./interfaces";
import { EMPTY_ARGS, UNDEFINED, bootstrapSymbol } from "./constants";
import { getAllFilesInDir, isFunction } from "./utils/utils";
import { getMetadata, hasMetadata, ModuleName } from "./utils/metadata";
import { Logger, LogLevel } from "./utils/logger";
import { DuplicateDefinitionError, InitializeMuduleError, ModuleDependencyNotFoundError } from "./errors";

function defaults(config: Partial<IContainerConfig>): IContainerConfig {
	return {
		logLevel: LogLevel.Error,
		rootDirs: [
			process.cwd()
		],
		logNamespace: "Container",
		globPattern: "/**/*.js",
		...config
	};
}

export default class InjexContainer {

	private moduleRegistry: Map<ModuleName, any>;
	private modules: Map<ModuleName, IModule>;

	public static create(config: IContainerConfig): InjexContainer {
		config = defaults(config);

		return new InjexContainer(
			config,
			new Logger(config.logLevel, config.logNamespace)
		);
	}

	private constructor(private config: IContainerConfig, private logger: Logger) {
		this.moduleRegistry = new Map<string, any>();
		this.modules = new Map<string, any>();

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

	private loadProjectFiles() {

		this.config.rootDirs

			// find all js files in the root directories
			.map((dir) => getAllFilesInDir(dir, this.config.globPattern))

			// flat into single array of files
			.reduce((allFiles: string[], files: string[]) => allFiles.concat(files), [])

			// require each file and register its module exports.
			.forEach((filePath) => {

				const moduleExports = require(filePath);

				for (const key of Reflect.ownKeys(moduleExports)) {
					this.register(
						moduleExports[key]
					);
				}
			});
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

	private createModules() {
		const self = this;

		this.moduleRegistry.forEach((item) => {

			const metadata = getMetadata(item);

			this.throwIfModuleExists(metadata.name);

			let module;

			if (metadata.singleton) {

				module = this.createInstance(item, EMPTY_ARGS);

			} else {

				module = async function factory(...args): Promise<any> {
					const instance = self.createInstance(item, args);
					self.injectModuleDependencies(instance, metadata);
					await self.invokeModuleInitMethod(instance, metadata);
					return instance;
				};
			}

			this.modules.set(metadata.name, { module, metadata });
		});
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
	 * Manually add object to the container
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