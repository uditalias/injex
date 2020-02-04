export declare class ModuleDependencyNotFoundError extends Error {
    constructor(moduleName: string, dependencyName: string);
}
export declare class InitializeMuduleError extends Error {
    constructor(moduleName: string);
}
export declare class DuplicateDefinitionError extends Error {
    constructor(moduleName: string);
}
export declare class MultipleBootstrapModulesFound extends Error {
    constructor(bootstrapModuleName: string, nextBootstrapModuleName: string);
}
