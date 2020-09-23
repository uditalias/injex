// tslint:disable max-classes-per-file
import { ModuleName } from "./interfaces";
import { getConstructorName } from "@injex/stdlib";

export class ModuleDependencyNotFoundError extends Error {
    constructor(moduleName: ModuleName, dependencyName: ModuleName) {
        super(
            `Dependency '${String(dependencyName)}' was not found for module '${String(moduleName)}'.`
        );
    }
}

export class InitializeMuduleError extends Error {
    constructor(moduleName: ModuleName) {
        super(
            `Failed to initialize module '${String(moduleName)}'.`
        );
    }
}

export class DuplicateDefinitionError extends Error {
    constructor(moduleName: ModuleName) {
        super(
            `Module '${String(moduleName)}' already defined.`
        );
    }
}

export class InvalidPluginError extends Error {
    constructor(plugin: any) {
        super(
            `Plugin ${getConstructorName(plugin)} is not valid. Make sure the 'apply' method exist.`
        );
    }
}
