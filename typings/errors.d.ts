import { ModuleName } from "./interfaces";
export declare class ModuleDependencyNotFoundError extends Error {
    constructor(moduleName: ModuleName, dependencyName: ModuleName);
}
export declare class InitializeMuduleError extends Error {
    constructor(moduleName: ModuleName);
}
export declare class DuplicateDefinitionError extends Error {
    constructor(moduleName: ModuleName);
}
export declare class InvalidPluginError extends Error {
    constructor(plugin: any);
}
export declare class RootDirectoryNotExistError extends Error {
    constructor(dir: string);
}
