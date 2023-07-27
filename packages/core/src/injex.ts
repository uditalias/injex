import { Hook, IConstructor, isFunction, isPromise, Logger, yieldToMain } from "@injex/stdlib";
import { ILazyModule } from "./interfaces";
import { bootstrapSymbol, EMPTY_ARGS, UNDEFINED } from "./constants";
import { BootstrapError, DuplicateDefinitionError, FactoryModuleNotExistsError, InitializeMuduleError, InvalidPluginError } from "./errors";
import { IModule, ModuleName, IInjexHooks, IContainerConfig, IBootstrap, IInjexPlugin, IDefinitionMetadata, AliasMap, AliasFactory } from "./interfaces";
import metadataHandlers from "./metadataHandlers";

export default abstract class InjexContainer<T extends IContainerConfig> {
    private _moduleRegistry: Map<ModuleName, any>;
    private _modules: Map<ModuleName | IConstructor, IModule>;
    private _aliases: Map<string, IModule[]>;
    private _logger: Logger;
    private _didBootstrapCalled: boolean;

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
    protected abstract loadContainerFiles(): void | Promise<void>;

    public static create(config: IContainerConfig): InjexContainer<IContainerConfig> {
        throw new Error("Static method create not implemented.");
    }

    protected constructor(config: T) {
        this.config = this.createConfig(config);
        this._logger = new Logger(this.config.logLevel, this.config.logNamespace);
        this._onInitModuleError = this._onInitModuleError.bind(this);
        this._didBootstrapCalled = false;

        this._moduleRegistry = new Map<ModuleName, any>();
        this._modules = new Map<ModuleName | IConstructor, IModule>();
        this._aliases = new Map<string, IModule[]>();

        this.addObject(this, "$injex");

        this._createHooks();

        this._logger.debug("Container created with config", this.config);
    }

    public async bootstrap(): Promise<InjexContainer<T>> {
        if (this._didBootstrapCalled) {
            throw new BootstrapError('container bootstrap should run only once.');
        }

        this._didBootstrapCalled = true;

        await this._initPlugins();

        this.hooks.beforeRegistration.call();

        await this.loadContainerFiles();

        this.hooks.afterRegistration.call();

        if (this.config.perfMode) {
            await this._createModulesAsync();
        } else {
            this._createModules();
        }

        const bootstrapModule = this.get<IBootstrap>(bootstrapSymbol);

        try {
            await this._initializeModules();

            this.hooks.bootstrapRun.call();

            await bootstrapModule?.run();

            this.hooks.bootstrapComplete.call();

            this._modulesReady();
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

    private async _createModulesAsync() {
        this.hooks.beforeCreateModules.call();

        const modules = Array.from(this._moduleRegistry.values());

        while (modules.length) {
            const item = modules.shift();
            this._createModule(item);
            await yieldToMain();
        }

        this.hooks.afterCreateModules.call();
    }

    private _createModules() {
        this.hooks.beforeCreateModules.call();

        this._moduleRegistry.forEach((item) => this._createModule(item));

        this.hooks.afterCreateModules.call();
    }

    private _createModule(item: IConstructor) {
        const metadata = metadataHandlers.getMetadata(item.prototype);

        this._throwIfModuleExists(metadata.name);

        let module;
        switch (true) {
            case metadata.lazy:
                const [loaderFn, loaderInstance] = this._createLazyModuleFactoryMethod(item, metadata);
                metadata.lazyLoader = loaderInstance;
                module = loaderFn;
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

    private _createLazyModuleFactoryMethod(construct: IConstructor, metadata: IDefinitionMetadata): [(...args: any[]) => any, ILazyModule<any>] {
        const self = this;
        const loaderInstance = this._createInstance(construct, EMPTY_ARGS);

        async function loaderFn(...args: any[]) {
            const Ctor: IConstructor = await loaderInstance.import.apply(loaderInstance, args);
            const lazyMetadata = metadataHandlers.getMetadata(Ctor.prototype);

            let lazyInstance;
            if (lazyMetadata && lazyMetadata.singleton && self.get(Ctor)) {
                lazyInstance = self.get(Ctor);
            } else {
                lazyInstance = self._createInstance(Ctor, args);
                self._injectModuleDependencies(lazyInstance);
                await self._invokeModuleInitMethod(lazyInstance, lazyMetadata);
                self._lazyInvokeModuleReadyMethod(lazyInstance, lazyMetadata);

                const moduleWithMetadata: IModule = {
                    module: lazyInstance, metadata: lazyMetadata
                };

                self._modules.set(lazyMetadata.name, moduleWithMetadata);

                if (lazyMetadata.aliases) {
                    let alias: string;
                    for (let i = 0, len = lazyMetadata.aliases.length; i < len; i++) {
                        alias = lazyMetadata.aliases[i];
                        if (!self._aliases.has(alias)) {
                            self._aliases.set(alias, []);
                        }

                        self._aliases.get(alias).push(moduleWithMetadata);
                    }
                }
            }

            return lazyInstance;
        }

        return [loaderFn, loaderInstance];
    }

    private _createModuleFactoryMethod(construct: IConstructor, metadata: IDefinitionMetadata): (...args) => Promise<void> {
        const self = this;

        return function factory(...args): Promise<any> {
            const instance = self._createInstance(construct, args);
            self._injectModuleDependencies(instance);
            const initValue: Promise<void> | void = self._invokeModuleInitMethod(instance, metadata);

            const _invokeReadyMethod = () => {
                self._lazyInvokeModuleReadyMethod(instance, metadata);
            }

            if (isPromise(initValue)) {
                return (initValue as Promise<void>)
                    .then(() => {
                        _invokeReadyMethod();
                        return instance;
                    })
                    .catch((err) => self._onInitModuleError(metadata, err));
            }

            _invokeReadyMethod();

            return instance;
        }
    }

    private async _initializeModules(): Promise<void> {
        await Promise.all(
            Array
                .from(this._modules.values())
                .map(({ module, metadata }) => {
                    if (metadata && metadata.singleton) {
                        this._injectModuleDependencies(metadata.lazyLoader || module);
                    }

                    return { module, metadata };
                })
                .map(async ({ module, metadata }) => {
                    if (metadata && metadata.singleton) {
                        await yieldToMain();
                        return this._invokeModuleInitMethod(
                            metadata.lazyLoader || module, metadata
                        );
                    }
                })
        );
    }

    private _modulesReady() {
        Array
            .from(this._modules.values())
            .map(({ module, metadata }) => {
                if (metadata && metadata.singleton) {
                    this._invokeModuleReadyMethod(
                        metadata.lazyLoader || module, metadata
                    );
                }
            })
    }

    private _invokeMetadataModuleMethod(module: any, metadata: IDefinitionMetadata, method: 'initMethod' | 'readyMethod', onError?: (metadata: IDefinitionMetadata, e: Error) => void): Promise<any> | any {
        const chain = [];
        metadataHandlers.forEachProtoMetadata(module, (_, meta: IDefinitionMetadata) => {
            if (meta?.[method] && chain.indexOf(meta[method]) < 0) {
                chain.push(meta[method]);
            }
        });

        try {
            const promises = [];
            for (let i = chain.length - 1; i >= 0; i--) {
                const res = module[chain[i]].call(module);
                if (isPromise(res)) {
                    promises.push(res);
                }
            }

            if (promises.length) {
                return Promise.all(promises).catch((e) => {
                    onError?.(metadata, e);
                });
            }
        } catch (e) {
            onError?.(metadata, e);
        }
    }

    private _lazyInvokeModuleReadyMethod(module: any, metadata: IDefinitionMetadata): Promise<any> | any {
        if (this.hooks.bootstrapComplete.calledOnce) {
            this._invokeModuleReadyMethod(metadata.lazyLoader || module, metadata);
        }
    }

    private _invokeModuleReadyMethod(module: any, metadata: IDefinitionMetadata): Promise<any> | any {
        return this._invokeMetadataModuleMethod(module, metadata, 'readyMethod');
    }

    private _invokeModuleInitMethod(module: any, metadata: IDefinitionMetadata): Promise<any> | any {
        return this._invokeMetadataModuleMethod(module, metadata, 'initMethod', this._onInitModuleError);
    }

    private _onInitModuleError(metadata: IDefinitionMetadata, err: Error) {
        this._logger.error(err);
        const error = new InitializeMuduleError(metadata.name);
        error.stack = err?.stack ?? error.stack;
        throw error;
    }

    private _createInstance(construct: any, args: any[] = []): any {
        this.hooks.beforeCreateInstance.call(construct, args);

        return new construct(...args);
    }

    public getModuleDefinition(moduleNameOrType: ModuleName | IConstructor): IModule {
        if (this._modules.has(moduleNameOrType)) {
            return this._modules.get(moduleNameOrType);
        } else if (moduleNameOrType instanceof Function && metadataHandlers.hasMetadata(moduleNameOrType.prototype)) {
            const metadata = metadataHandlers.getMetadata(moduleNameOrType.prototype);
            return this._modules.get(metadata.name);
        }

        return null;
    }

    private _injectModuleDependencies(module: any) {
        const self = this;

        metadataHandlers.forEachProtoMetadata(module, (_, meta) => {
            const dependencies = meta.dependencies || [];
            const aliasDependencies = meta.aliasDependencies || [];
            const factoryDependencies = meta.factoryDependencies || [];
            const paramDependencies = meta.paramDependencies || [];

            for (const { label, value } of dependencies) {
                Object.defineProperty(module, label, {
                    configurable: true,
                    get: () => this.get(value) || null
                });
            }

            for (const { label, alias, keyBy } of aliasDependencies) {
                Object.defineProperty(module, label, {
                    configurable: true,
                    get: () => this.getAlias(alias, keyBy)
                });
            }

            for (const { label, value } of factoryDependencies) {
                const factory = this.get(value);
                if (!factory) {
                    throw new FactoryModuleNotExistsError(value);
                }

                const item = factory();
                Object.defineProperty(module, label, {
                    configurable: true,
                    get: () => isPromise(item) ? item.then((instance) => instance) : item
                });
            }

            for (const { methodName, index, value } of paramDependencies) {
                const org = module[methodName];
                module[methodName] = function (...args: any[]) {
                    args[index] = self.get(value);
                    return org.apply(module, args);
                };
            }
        });
    }

    private _register(item: IConstructor) {
        if (!item?.prototype ?? !metadataHandlers.hasMetadata(item.prototype)) {
            return;
        }

        const metadata = metadataHandlers.getMetadata(item.prototype);

        if (!metadata || !metadata.name) {
            return;
        }

        this._throwIfAlreadyDefined(metadata.name);

        this._moduleRegistry.set(metadata.name, item);
    }

    /**
     * Manually add module with metadata
     *
     * @param item - Module with metadata to add
     */
    public addModule(item: IConstructor): Promise<InjexContainer<T>> {
        if (!metadataHandlers.hasMetadata(item.prototype)) {
            this._logger.debug("You're trying to add module without any metadata.");
            return Promise.resolve(this);
        }

        this._register(item);

        if (!this._didBootstrapCalled) {
            return Promise.resolve(this);
        }

        this._createModule(item);

        const { module, metadata } = this.getModuleDefinition(item);

        let optionalPromise: Promise<any> = null;
        if (metadata && metadata.singleton) {
            this._injectModuleDependencies(metadata.lazyLoader || module);
            optionalPromise = this._invokeModuleInitMethod(metadata.lazyLoader || module, metadata);
        }

        return (isPromise(optionalPromise) ? optionalPromise : Promise.resolve()).then(() => {
            this._lazyInvokeModuleReadyMethod(metadata.lazyLoader || module, metadata);

            return this;
        });
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

    private _getMany(...itemNameOrType: (ModuleName | IConstructor)[]): any[] {
        const results = [];

        while (itemNameOrType.length) {
            results.push(this.get(itemNameOrType.shift()));
        }

        return results;
    }

    public get<K = any>(itemNameOrType: ModuleName | IConstructor): K;
    public get<T1>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1];
    public get<T1, T2>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2];
    public get<T1, T2, T3>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3];
    public get<T1, T2, T3, T4>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3, T4];
    public get<T1, T2, T3, T4, T5>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3, T4, T5];
    public get<T1, T2, T3, T4, T5, T6>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3, T4, T5, T6];
    public get<T1, T2, T3, T4, T5, T6, T7>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3, T4, T5, T6, T7];
    public get<T1, T2, T3, T4, T5, T6, T7, T8>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3, T4, T5, T6, T7, T8];
    public get<T1, T2, T3, T4, T5, T6, T7, T8, T9>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3, T4, T5, T6, T7, T8, T9];
    public get<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(...itemNameOrType: (ModuleName | IConstructor)[]): [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10];
    public get<K = any>(...itemNameOrType: (ModuleName | IConstructor)[]): K | any[] {
        if (itemNameOrType.length > 1) {
            return this._getMany(...itemNameOrType);
        }

        const definition = this.getModuleDefinition(itemNameOrType[0]);

        if (!definition) {
            return UNDEFINED;
        }

        return definition.module;
    }

    public getAlias<K extends string = string, V = any>(alias: string, keyBy?: string): AliasMap<K, V> | AliasFactory<K, V> | V[] {
        const aliasModules = this._aliases.get(alias) || [];
        const useSet = !keyBy;
        const mapOrSet: any = useSet ? [] : {};

        for (const aliasModule of aliasModules) {
            if (useSet) {
                mapOrSet.push(aliasModule.module);
            } else {
                let keyValue: string;
                switch (true) {
                    case aliasModule.metadata.lazy:
                        keyValue = aliasModule.metadata.lazyLoader[keyBy]; break;
                    case aliasModule.metadata.singleton:
                        keyValue = aliasModule.module[keyBy]; break;
                    default:
                        keyValue = aliasModule.metadata.item[keyBy];
                }

                if (keyValue) {
                    mapOrSet[keyValue] = aliasModule.module;
                }
            }
        }

        return mapOrSet as AliasMap<K, V> | AliasFactory<K, V> | V[];
    }
}