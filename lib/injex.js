"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const utils_1 = require("./utils/utils");
const metadata_1 = require("./utils/metadata");
const logger_1 = require("./utils/logger");
const errors_1 = require("./errors");
const tapable_1 = require("tapable");
const createConfig_1 = require("./createConfig");
class InjexContainer {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.moduleRegistry = new Map();
        this.modules = new Map();
        this.createHooks();
        this.logger.debug("Container created with config", this.config);
    }
    static create(config) {
        config = createConfig_1.default(config);
        return new InjexContainer(config, new logger_1.Logger(config.logLevel, config.logNamespace));
    }
    async bootstrap() {
        await this.initPlugins();
        this.loadProjectFiles();
        this.createModules();
        await this.initializeModules();
        const bootstrapModule = this.get(constants_1.bootstrapSymbol);
        if (bootstrapModule) {
            await bootstrapModule.run();
        }
        return this;
    }
    initPlugins() {
        if (!this.config.plugins || !this.config.plugins.length) {
            return;
        }
        const applyPluginPromises = [];
        for (const plugin of this.config.plugins) {
            this.throwIfInvalidPlugin(plugin);
            applyPluginPromises.push(plugin.apply(this));
        }
        return Promise.all(applyPluginPromises);
    }
    createHooks() {
        this.hooks = {};
        this.hooks.beforeRegistration = new tapable_1.SyncHook();
        this.hooks.afterRegistration = new tapable_1.SyncHook();
        this.hooks.beforeCreateModules = new tapable_1.SyncHook();
        this.hooks.afterModuleCreation = new tapable_1.SyncHook(["module"]);
        this.hooks.afterCreateModules = new tapable_1.SyncHook();
        this.hooks.beforeModuleRequire = new tapable_1.SyncHook(["filePath"]);
        this.hooks.afterModuleRequire = new tapable_1.SyncHook(["filePath", "module"]);
        this.hooks.berforeCreateInstance = new tapable_1.SyncHook(["construct", "args"]);
    }
    loadProjectFiles() {
        this.hooks.beforeRegistration.call();
        this.config.rootDirs
            // find all js files in the root directories
            .map((dir) => utils_1.getAllFilesInDir(dir, this.config.globPattern))
            // flat into single array of files
            .reduce((allFiles, files) => allFiles.concat(files), [])
            // require each file and register its module exports.
            .forEach((filePath) => {
            this.hooks.beforeModuleRequire.call(filePath);
            const moduleExports = require(filePath);
            this.hooks.afterModuleRequire.call(filePath, moduleExports);
            for (const key of Reflect.ownKeys(moduleExports)) {
                this.register(moduleExports[key]);
            }
        });
        this.hooks.afterRegistration.call();
    }
    throwIfAlreadyDefined(name) {
        if (this.moduleRegistry.has(name)) {
            throw new errors_1.DuplicateDefinitionError(name);
        }
    }
    throwIfModuleExists(name) {
        if (this.modules.has(name)) {
            throw new errors_1.DuplicateDefinitionError(name);
        }
    }
    throwIfInvalidPlugin(plugin) {
        if (!plugin.apply || !utils_1.isFunction(plugin.apply)) {
            throw new errors_1.InvalidPluginError(plugin);
        }
    }
    createModules() {
        this.hooks.beforeCreateModules.call();
        this.moduleRegistry.forEach((item) => {
            const metadata = metadata_1.default.getMetadata(item);
            this.throwIfModuleExists(metadata.name);
            const module = metadata.singleton
                ? this.createInstance(item, constants_1.EMPTY_ARGS)
                : this.createModuleFactoryMethod(item, metadata);
            const moduleWithMetadata = {
                module, metadata
            };
            this.modules.set(metadata.name, moduleWithMetadata);
            this.hooks.afterModuleCreation.call(moduleWithMetadata);
        });
        this.hooks.afterCreateModules.call();
    }
    createModuleFactoryMethod(construct, metadata) {
        const self = this;
        return async function factory(...args) {
            const instance = self.createInstance(construct, args);
            self.injectModuleDependencies(instance, metadata);
            await self.invokeModuleInitMethod(instance, metadata);
            return instance;
        };
    }
    async initializeModules() {
        await Promise.all(Array
            .from(this.modules.values())
            .map(async ({ module, metadata }) => {
            if (metadata && metadata.singleton) {
                this.injectModuleDependencies(module, metadata);
                return this.invokeModuleInitMethod(module, metadata);
            }
        }));
    }
    async invokeModuleInitMethod(module, metadata) {
        if (metadata.initMethod && utils_1.isFunction(module[metadata.initMethod])) {
            try {
                await module[metadata.initMethod]();
            }
            catch (e) {
                throw new errors_1.InitializeMuduleError(metadata.name);
            }
        }
    }
    createInstance(construct, args) {
        this.hooks.berforeCreateInstance.call(construct, args);
        return Reflect.construct(construct, args);
    }
    injectModuleDependencies(module, metadata) {
        const dependencies = metadata.dependencies || [];
        for (const { label, value } of dependencies) {
            let dependency;
            if (this.modules.has(value)) {
                dependency = this.modules.get(value).module;
            }
            else if (value instanceof Function) {
                metadata = metadata_1.default.getMetadata(value);
                dependency = this.modules.get(metadata.name).module;
            }
            if (!dependency) {
                throw new errors_1.ModuleDependencyNotFoundError(metadata.name, value);
            }
            module[label] = dependency;
        }
    }
    register(item) {
        if (!item || !metadata_1.default.hasMetadata(item)) {
            return;
        }
        const metadata = metadata_1.default.getMetadata(item);
        this.throwIfAlreadyDefined(metadata.name);
        this.moduleRegistry.set(metadata.name, item);
    }
    /**
     * Manually add object to the container as singleton
     *
     * @param obj - Object to add
     * @param name - Name of the object
     */
    addObject(obj, name) {
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
    removeObject(name) {
        this.modules.delete(name);
        this.moduleRegistry.delete(name);
        return this;
    }
    get(itemNameOrType) {
        if (!this.modules.has(itemNameOrType)) {
            return constants_1.UNDEFINED;
        }
        const { module } = this.modules.get(itemNameOrType);
        return module;
    }
}
exports.default = InjexContainer;
//# sourceMappingURL=injex.js.map