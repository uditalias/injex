// interfaces
export * from "./interfaces";

// decorators
export { define } from "./decorators/define";
export { inject } from "./decorators/inject";
export { singleton } from "./decorators/singleton";
export { init } from "./decorators/init";
export { bootstrap } from "./decorators/bootstrap";

// plugins
import HooksLoggerPlugin from "./plugins/HooksLoggerPlugin";

export const plugins = {
	HooksLoggerPlugin,
};

// errors
import {
	DuplicateDefinitionError,
	InitializeMuduleError,
	ModuleDependencyNotFoundError,
	InvalidPluginError,
	RootDirectoryNotExistError,
} from "./errors";

export const errors = {
	DuplicateDefinitionError,
	InitializeMuduleError,
	ModuleDependencyNotFoundError,
	InvalidPluginError,
	RootDirectoryNotExistError,
};

export { createMetadataHandlers } from "./utils/metadata";

export { LogLevel } from "./utils/logger";

export { default as Injex } from "./injex";