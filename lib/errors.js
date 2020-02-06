"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils/utils");
// tslint:disable max-classes-per-file
class ModuleDependencyNotFoundError extends Error {
    constructor(moduleName, dependencyName) {
        super(`Dependency '${String(dependencyName)}' was not found for module '${String(moduleName)}'.`);
    }
}
exports.ModuleDependencyNotFoundError = ModuleDependencyNotFoundError;
class InitializeMuduleError extends Error {
    constructor(moduleName) {
        super(`Failed to initialize module '${String(moduleName)}'.`);
    }
}
exports.InitializeMuduleError = InitializeMuduleError;
class DuplicateDefinitionError extends Error {
    constructor(moduleName) {
        super(`Module '${String(moduleName)}' already defined.`);
    }
}
exports.DuplicateDefinitionError = DuplicateDefinitionError;
class InvalidPluginError extends Error {
    constructor(plugin) {
        super(`Plugin ${utils_1.getPluginName(plugin)} is not valid. Make sure the 'apply' method exist.`);
    }
}
exports.InvalidPluginError = InvalidPluginError;
//# sourceMappingURL=errors.js.map