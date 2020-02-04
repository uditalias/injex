"use strict";
// tslint:disable max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleDependencyNotFoundError extends Error {
    constructor(moduleName, dependencyName) {
        super(`Dependency '${dependencyName}' was not found for module '${moduleName}'.`);
    }
}
exports.ModuleDependencyNotFoundError = ModuleDependencyNotFoundError;
class InitializeMuduleError extends Error {
    constructor(moduleName) {
        super(`Failed to initialize module '${moduleName}'.`);
    }
}
exports.InitializeMuduleError = InitializeMuduleError;
class DuplicateDefinitionError extends Error {
    constructor(moduleName) {
        super(`Module '${moduleName}' already defined.`);
    }
}
exports.DuplicateDefinitionError = DuplicateDefinitionError;
class MultipleBootstrapModulesFound extends Error {
    constructor(bootstrapModuleName, nextBootstrapModuleName) {
        super(`Multiple bootstrap modules found [${bootstrapModuleName}, ${nextBootstrapModuleName}]`);
    }
}
exports.MultipleBootstrapModulesFound = MultipleBootstrapModulesFound;
//# sourceMappingURL=errors.js.map