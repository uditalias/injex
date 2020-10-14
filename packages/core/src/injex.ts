import { Hook, IConstructor, isFunction, isPromise, Logger } from "@injex/stdlib";
import { bootstrapSymbol, EMPTY_ARGS, UNDEFINED } from "./constants";
import { DuplicateDefinitionError, InitializeMuduleError, InvalidPluginError, ModuleDependencyNotFoundError } from "./errors";
import { IModule, ModuleName, IInjexHooks, IContainerConfig, IBootstrap, IInjexPlugin, IDefinitionMetadata, AliasMap, AliasFactory } from "./interfaces";
import metadataHandlers from "./metadataHandlers";

export default abstract class InjexContainer<T extends IContainerConfig> {
    private _moduleRegistry: Map<ModuleName, any>;
    private _modules: Map<ModuleName | IConstructor, IModule>;
    private _aliases: Map<string, IModule[]>;
    private _logger: Logger;

    protected config: T;

    public hooks: IInjexHooks;

    public get logger(): Logger {
        return this._logger;
    }

    /**
     * Parse and extend with default values configuration
     *
     * @param config - the config object from the constfuctor
     */
    protected abstract createConfig(config?: Partial<T>): T;

    /**
     * Load all project files and call `registerModuleExports` for each module
     */
    protected abstract loadContainerFiles(): void;

    public static create(config: IContainerConfig): InjexContainer<IContainerConfig> {
        throw new Error("Static method create not implemented.");
    }

    protected constructor(config: T) {
        this.config = this.createConfig(config);
        this._logger = new Logger(this.config.logLevel, this.config.logNamespace);

        this._moduleRegistry = new Map<ModuleName, any>();
        this._modules = new Map<ModuleName | IConstructor, IModule>();
        this._aliases = new Map<string, IModule[]>();

        this.addObject(this, "$injex");

        this._createHooks();

        this._logger.debug("Container created with config", this.config);
    }

    public async bootstrap(): Promise<InjexContainer<T>> {

        await this._initPlugins();

        this.hooks.beforeRegistration.call();

        this.loadContainerFiles();

        this.hooks.afterRegistration.call();

        this._createModules();

        const bootstrapModule = this.get<IBootstrap>(bootstrapSymbol);

        try {
            await this._initializeModules();

            this.hooks.bootstrapRun.call();

            await bootstrapModule?.run();

            this.hooks.bootstrapComplete.call();
        } catch (e) {

            this.hooks.bootstrapError.call(e);

            if (bootstrapModule?.didCatch) {
                bootstrapModule?.didCatch(e);
            } else {
                throw e;
            }
        }

        return this;
    }

    protected registerModuleExports(moduleExports) {
        for (const key of Object.getOwnPropertyNames(moduleExports)) {
            this._register(
                moduleExports[key]
            );
        }
    }

    private _initPlugins() {
        const { plugins } = this.config;

        if (!plugins || !plugins.length) {
            return;
        }

        const applyPluginPromises: Promise<void>[] = [];

        for (const plugin of plugins) {
            this._throwIfInvalidPlugin(plugin);

            applyPluginPromises.push(
                (plugin.apply(this) || Promise.resolve())
            );
        }

        return Promise.all(applyPluginPromises);
    }

    private _throwIfAlreadyDefined(name: ModuleName) {
        if (this._moduleRegistry.has(name)) {
            throw new DuplicateDefinitionError(name);
        }
    }

    private _throwIfModuleExists(name: ModuleName) {
        if (this._modules.has(name)) {
            throw new DuplicateDefinitionError(name);
        }
    }

    private _throwIfInvalidPlugin(plugin: IInjexPlugin) {
        if (!plugin.apply || !isFunction(plugin.apply)) {
            throw new InvalidPluginError(plugin);
        }
    }

    private _createHooks() {
        this.hooks = {
            beforeRegistration: new Hook(),
            afterRegistration: new Hook(),
            beforeCreateModules: new Hook(),
            afterModuleCreation: new Hook(),
            afterCreateModules: new Hook(),
            beforeCreateInstance: new Hook(),
            bootstrapRun: new Hook(),
            bootstrapError: new Hook(),
            bootstrapComplete: new Hook(),
        };
    }

    private _createModules() {

        this.hooks.beforeCreateModules.call();

        this._moduleRegistry.forEach((item) => this._createModule(item));

        this.hooks.afterCreateModules.call();
    }

    private _createModule(item) {
        const metadata = metadataHandlers.getMetadata(item);

        this._throwIfModuleExists(metadata.name);

        let module;
        switch (true) {
            case metadata.lazy:
                module = this._createLazyModuleFactoryMethod(item, metadata);
                break;
            case metadata.singleton:
                module = this._createInstance(item, EMPTY_ARGS);
                break;
            default:
                module = this._createModuleFactoryMethod(item, metadata);
        }

        const moduleWithMetadata: IModule = {
            module, metadata
        };

        this._modules.set(metadata.name, moduleWithMetadata);

        if (metadata.aliases) {
            let alias: string;
            for (let i = 0, len = metadata.aliases.length; i < len; i++) {
                alias = metadata.aliases[i];
                if (!this._aliases.has(alias)) {
                    this._aliases.set(alias, []);
                }

                this._aliases.get(alias).push(moduleWithMetadata);
            }
        }

        this.hooks.afterModuleCreation.call(moduleWithMetadata);
    }

    private _createLazyModuleFactoryMethod(construct: IConstructor, metadata: IDefinitionMetadata) {
        const self = this;
        const instance = this._createInstance(construct, EMPTY_ARGS);
        this._injectModuleDependencies(instance, metadata);

        return async function (...args: any[]) {
            const Ctor = await instance.import.apply(instance, args);
            const lazyMetadata = metadataHandlers.getMetadata(Ctor);
            const lazyInstance = self._createInstance(Ctor, args);
            self._injectModuleDependencies(lazyInstance, lazyMetadata);
            await self._invokeModuleInitMethod(lazyInstance, lazyMetadata);

            return lazyInstance;
        }
    }

    private _createModuleFactoryMethod(construct: IConstructor, metadata: IDefinitionMetadata): (...args) => Promise<void> {
        const self = this;

        return function factory(...args): Promise<any> {
            const instance = self._createInstance(construct, args);
            self._injectModuleDependencies(instance, metadata);
            const initValue: Promise<void> | void = self._invokeModuleInitMethod(instance, metadata);

            if (isPromise(initValue)) {
                return (initValue as Promise<void>)
                    .then(() => instance)
                    .catch((err) => this._onInitModuleError(metadata, err));
            }

            return instance;
        }
    }

    private async _initializeModules(): Promise<void> {
        await Promise.all(
            Array
                .from(this._modules.values())
                .map(async ({ module, metadata }) => {
                    if (metadata && metadata.singleton) {
                        this._injectModuleDependencies(module, metadata);
                        return this._invokeModuleInitMethod(module, metadata);
                    }
                })
        );
    }

    private _invokeModuleInitMethod(module: any, metadata: IDefinitionMetadata): Promise<void> | void {
        if (metadata.initMethod && isFunction(module[metadata.initMethod])) {
            try {
                return module[metadata.initMethod]();
            } catch (e) {
                this._onInitModuleError(metadata, e);
            }
        }
    }

    private _onInitModuleError(metadata: IDefinitionMetadata, err: Error) {
        this._logger.error(err);
        throw new InitializeMuduleError(metadata.name);
    }

    private _createInstance(construct: any, args: any[] = []): any {
        this.hooks.beforeCreateInstance.call(construct, args);

        return new construct(...args);
    }

    public getModuleDefinition(moduleNameOrType: ModuleName | IConstructor): IModule {
        if (this._modules.has(moduleNameOrType)) {
            return this._modules.get(moduleNameOrType);
        } else if (moduleNameOrType instanceof Function) {
            const metadata = metadataHandlers.getMetadata(moduleNameOrType);
            return this._modules.get(metadata.name);
        }

        return null;
    }

    private _injectModuleDependencies(module: any, metadata: IDefinitionMetadata) {
        const dependencies = metadata.dependencies || [];
        const aliasDependencies = metadata.aliasDependencies || [];

        for (const { label, value } of dependencies) {
            const dependency = this.get(value);

            if (!dependency) {
                throw new ModuleDependencyNotFoundError(metadata.name, value);
            }

            module[label] = dependency;
        }

        for (const { label, alias, keyBy } of aliasDependencies) {
            module[label] = this.getAlias(alias, keyBy);
        }
    }

    private _register(item: any) {
        if (!item || !metadataHandlers.hasMetadata(item)) {
            return;
        }

        const metadata = metadataHandlers.getMetadata(item);

        this._throwIfAlreadyDefined(metadata.name);

        this._moduleRegistry.set(metadata.name, item);
    }

    /**
     * Manually add object to the container as singleton
     *
     * @param obj - Object to add
     * @param name - Name of the object
     */
    public addObject(obj: any, name: ModuleName): InjexContainer<T> {

        this._throwIfModuleExists(name);

        const metadata = { singleton: true, item: obj, name };

        this._modules.set(name, { module: obj, metadata });

        return this;
    }

    /**
     * Remove object from container
     *
     * @param name - Name of the object
     */
    public removeObject(name: ModuleName): InjexContainer<T> {
        this._modules.delete(name);
        this._moduleRegistry.delete(name);

        return this;
    }

    public get<K = any>(itemNameOrType: ModuleName | IConstructor): K {
        const definition = this.getModuleDefinition(itemNameOrType);

        if (!definition) {
            return UNDEFINED;
        }

        return definition.module;
    }

    public getAlias<K extends string = string, V = any>(alias: string, keyBy: string): AliasMap<K, V> | AliasFactory<K, V> {
        const aliasModules = this._aliases.get(alias) || [];
        const map = {};

        for (const aliasModule of aliasModules) {
            const keyValue = aliasModule.metadata.singleton ? aliasModule.module[keyBy] : aliasModule.metadata.item[keyBy];
            map[keyValue] = aliasModule.module;
        }

        return map as AliasMap<K, V> | AliasFactory<K, V>;
    }
}