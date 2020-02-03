import { IModule, IContainerConfig, IDefinitionMetadata } from "./interfaces";
import { EMPTY_ARGS, UNDEFINED } from "./constants";
import { getAllFilesInDir, isFunction } from "./utils/utils";
import { getMetadata, hasMetadata } from "./utils/metadata";
import { Logger, LogLevel } from "./utils/logger";
import { DuplicateDefinitionError, InitializeMuduleError, ModuleDependencyNotFoundError } from "./errors";

function defaults(config: Partial<IContainerConfig>): IContainerConfig {
	return {
		logLevel: LogLevel.Error,
		rootDirs: [],
		logNamespace: "Container",
		globPattern: "/**/*.js",
		...config
	};
}

export default class Container {

	private moduleRegistry: Map<string, any>;
	private modules: Map<string, IModule>;

	public static create(config: IContainerConfig): Container {
		config = defaults(config);

		return new Container(
			config,
			new Logger(config.logLevel, config.logNamespace)
		);
	}

	private constructor(private config: IContainerConfig, private logger: Logger) {
		this.moduleRegistry = new Map<string, any>();
		this.modules = new Map<string, any>();

		this.logger.debug("Container created with config", this.config);
	}

	public async bootstrap(): Promise<Container> {
		this.loadProjectFiles();

		this.createModules();

		await this.initializeModules();

		return this;
	}

	private loadProjectFiles() {

		this.config.rootDirs

			// find all js files in the root directories
			.map((dir) => getAllFilesInDir(dir, this.config.globPattern))

			// flat into single files array
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

	private throwIfAlreadyDefined(name: string) {
		if (this.moduleRegistry.has(name)) {
			throw new DuplicateDefinitionError(name);
		}
	}

	private throwIfModuleExists(name: string) {
		if (this.modules.has(name)) {
			throw new DuplicateDefinitionError(name);
		}
	}

	private createModules() {
		const self = this;

		this.moduleRegistry.forEach((item) => {

			const metadata = getMetadata(item.prototype);

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
			} else {
				if (!value.prototype) {
					throw new ModuleDependencyNotFoundError(metadata.name, value);
				}

				metadata = getMetadata(value.prototype);

				dependency = this.modules.get(metadata.name).module;
			}

			module[label] = dependency;
		}
	}

	private register(item: any) {
		if (!item || !hasMetadata(item.prototype)) {
			return;
		}

		const metadata = getMetadata(item.prototype);

		this.throwIfAlreadyDefined(metadata.name);

		this.moduleRegistry.set(metadata.name, item);
	}

	/**
	 * Manually add object as a module
	 * 
	 * @param obj - Object to add
	 * @param name - Name of the object
	 */
	public addObject(obj: any, name: string): Container {

		this.throwIfModuleExists(name);

		const metadata = { singleton: true, item: obj, name };

		this.modules.set(name, { module: obj, metadata });

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