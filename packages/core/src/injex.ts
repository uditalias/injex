import { Hook, IConstructor, isFunction, Logger } from "@injex/stdlib";
import { bootstrapSymbol, EMPTY_ARGS, UNDEFINED } from "./constants";
import { DuplicateDefinitionError, InitializeMuduleError, InvalidPluginError, ModuleDependencyNotFoundError } from "./errors";
import { IModule, ModuleName, IInjexHooks, IContainerConfig, IBootstrap, IInjexPlugin, IDefinitionMetadata } from "./interfaces";
import metadataHandlers from "./metadataHandlers";

export default abstract class InjexContainer<T extends IContainerConfig> {
    private _moduleRegistry: Map<ModuleName, any>;
    private _modules: Map<ModuleName | IConstructor, IModule>;
    private _aliases: Map<string, IModule[]>;
    private _logger: Logger;

    protected config: T;

    public hooks: IInjexHooks;

    /**
     * Parse and extend with default values configuration
     * 
     * @param config - the config object from the constfuctor
     */
    protected abstract createConfig(config: Partial<T>): T;

    /**
     * Load all project files and call `registerModuleExports` with each module
     */
    protected abstract loadContainerFiles(): void;

    protected constructor(config: T) {
        this.config = this.createConfig(config);
        this._logger = new Logger(config.logLevel, config.logNamespace);

        this._moduleRegistry = new Map<ModuleName, any>();
        this._modules = new Map<ModuleName | IConstructor, IModule>();
        this._aliases = new Map<string, IModule[]>();

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

            await bootstrapModule?.run();
        } catch (e) {
            bootstrapModule?.didCatch(e);
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
                plugin.apply(this)
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
            berforeCreateInstance: new Hook(),
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
                module = this._createInstance(item, EMPTY_ARGS)
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
            return lazyInstance;
        }
    }

    private _createModuleFactoryMethod(construct: IConstructor, metadata: IDefinitionMetadata): (...args) => Promise<void> {
        const self = this;

        return async function factory(...args): Promise<void> {
            const instance = self._createInstance(construct, args);
            self._injectModuleDependencies(instance, metadata);
            await self._invokeModuleInitMethod(instance, metadata);
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

    private async _invokeModuleInitMethod(module: any, metadata: IDefinitionMetadata): Promise<void> {
        if (metadata.initMethod && isFunction(module[metadata.initMethod])) {
            try {
                await module[metadata.initMethod]();
            } catch (e) {
                this._logger.error(e);
                throw new InitializeMuduleError(metadata.name);
            }
        }
    }

    private _createInstance(construct: any, args: any[] = []): any {
        this.hooks.berforeCreateInstance.call(construct, args);

        return new construct(...args);
    }

    private _injectModuleDependencies(module: any, metadata: IDefinitionMetadata) {
        const dependencies = metadata.dependencies || [];
        const aliasFactories = metadata.aliasFactories || [];

        for (const { label, value } of dependencies) {

            let dependency;

            if (this._modules.has(value)) {
                dependency = this._modules.get(value).module;
            } else if (value instanceof Function) {
                metadata = metadataHandlers.getMetadata(value);
                dependency = this._modules.get(metadata.name).module;
            }

            if (!dependency) {
                throw new ModuleDependencyNotFoundError(metadata.name, value);
            }

            module[label] = dependency;
        }

        for (const { label, alias, keyBy } of aliasFactories) {
            const aliasModules = this._aliases.get(alias);

            if (!aliasModules) {
                throw new ModuleDependencyNotFoundError(metadata.name, alias);
            }

            module[label] = {};

            for (const aliasModule of aliasModules) {
                const keyValue = aliasModule.metadata.item[keyBy];
                module[label][keyValue] = aliasModule.module;
            }
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

    public get<T = any>(itemNameOrType: ModuleName | IConstructor): T {
        if (!this._modules.has(itemNameOrType)) {
            return UNDEFINED;
        }

        const {
            module
        } = this._modules.get(itemNameOrType);

        return module;
    }
}