export { define } from "./decorators/define";
export { inject } from "./decorators/inject";
export { singleton } from "./decorators/singleton";
export { init } from "./decorators/init";
export { bootstrap } from "./decorators/bootstrap";
import HooksLoggerPlugin from "./plugins/HooksLoggerPlugin";
export declare const plugins: {
    HooksLoggerPlugin: typeof HooksLoggerPlugin;
};
import { DuplicateDefinitionError, InitializeMuduleError, ModuleDependencyNotFoundError } from "./errors";
export declare const errors: {
    DuplicateDefinitionError: typeof DuplicateDefinitionError;
    InitializeMuduleError: typeof InitializeMuduleError;
    ModuleDependencyNotFoundError: typeof ModuleDependencyNotFoundError;
};
export { LogLevel } from "./utils/logger";
export { default as Injex } from "./injex";
