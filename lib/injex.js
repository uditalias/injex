"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const utils_1 = require("./utils/utils");
const metadata_1 = require("./utils/metadata");
const logger_1 = require("./utils/logger");
const errors_1 = require("./errors");
function defaults(config) {
    return {
        logLevel: logger_1.LogLevel.Error,
        rootDirs: [
            process.cwd()
        ],
        logNamespace: "Container",
        globPattern: "/**/*.js",
        ...config
    };
}
class InjexContainer {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.moduleRegistry = new Map();
        this.modules = new Map();
        this.logger.debug("Container created with config", this.config);
    }
    static create(config) {
        config = defaults(config);
        return new InjexContainer(config, new logger_1.Logger(config.logLevel, config.logNamespace));
    }
    async bootstrap() {
        this.loadProjectFiles();
        this.createModules();
        await this.initializeModules();
        const bootstrapModule = this.get(constants_1.bootstrapSymbol);
        if (bootstrapModule) {
            await bootstrapModule.run();
        }
        return this;
    }
    loadProjectFiles() {
        this.config.rootDirs
            // find all js files in the root directories
            .map((dir) => utils_1.getAllFilesInDir(dir, this.config.globPattern))
            // flat into single files array
            .reduce((allFiles, files) => allFiles.concat(files), [])
            // require each file and register its module exports.
            .forEach((filePath) => {
            const moduleExports = require(filePath);
            for (const key of Reflect.ownKeys(moduleExports)) {
                this.register(moduleExports[key]);
            }
        });
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
    createModules() {
        const self = this;
        this.moduleRegistry.forEach((item) => {
            const metadata = metadata_1.getMetadata(item.prototype);
            this.throwIfModuleExists(metadata.name);
            let module;
            if (metadata.singleton) {
                module = this.createInstance(item, constants_1.EMPTY_ARGS);
            }
            else {
                module = async function factory(...args) {
                    const instance = self.createInstance(item, args);
                    self.injectModuleDependencies(instance, metadata);
                    await self.invokeModuleInitMethod(instance, metadata);
                    return instance;
                };
            }
            this.modules.set(metadata.name, { module, metadata });
        });
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
        return Reflect.construct(construct, args);
    }
    injectModuleDependencies(module, metadata) {
        const dependencies = metadata.dependencies || [];
        for (const { label, value } of dependencies) {
            let dependency;
            if (this.modules.has(value)) {
                dependency = this.modules.get(value).module;
            }
            else {
                if (!value.prototype) {
                    throw new errors_1.ModuleDependencyNotFoundError(metadata.name, value);
                }
                metadata = metadata_1.getMetadata(value.prototype);
                dependency = this.modules.get(metadata.name).module;
            }
            module[label] = dependency;
        }
    }
    register(item) {
        if (!item || !metadata_1.hasMetadata(item.prototype)) {
            return;
        }
        const metadata = metadata_1.getMetadata(item.prototype);
        this.throwIfAlreadyDefined(metadata.name);
        this.moduleRegistry.set(metadata.name, item);
    }
    /**
     * Manually add object to the container
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