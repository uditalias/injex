"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable max-classes-per-file
class ModuleDependencyNotFoundError extends Error {
    constructor(moduleName, dependencyName) {
        moduleName = moduleName.toString();
        dependencyName = dependencyName.toString();
        super(`Dependency '${dependencyName}' was not found for module '${moduleName}'.`);
    }
}
exports.ModuleDependencyNotFoundError = ModuleDependencyNotFoundError;
class InitializeMuduleError extends Error {
    constructor(moduleName) {
        moduleName = moduleName.toString();
        super(`Failed to initialize module '${moduleName}'.`);
    }
}
exports.InitializeMuduleError = InitializeMuduleError;
class DuplicateDefinitionError extends Error {
    constructor(moduleName) {
        moduleName = moduleName.toString();
        super(`Module '${moduleName}' already defined.`);
    }
}
exports.DuplicateDefinitionError = DuplicateDefinitionError;
//# sourceMappingURL=errors.js.map