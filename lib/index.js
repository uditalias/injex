"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// decorators
var define_1 = require("./decorators/define");
exports.define = define_1.define;
var inject_1 = require("./decorators/inject");
exports.inject = inject_1.inject;
var singleton_1 = require("./decorators/singleton");
exports.singleton = singleton_1.singleton;
var init_1 = require("./decorators/init");
exports.init = init_1.init;
var bootstrap_1 = require("./decorators/bootstrap");
exports.bootstrap = bootstrap_1.bootstrap;
// plugins
const HooksLoggerPlugin_1 = require("./plugins/HooksLoggerPlugin");
exports.plugins = {
    HooksLoggerPlugin: HooksLoggerPlugin_1.default,
};
// errors
const errors_1 = require("./errors");
exports.errors = {
    DuplicateDefinitionError: errors_1.DuplicateDefinitionError,
    InitializeMuduleError: errors_1.InitializeMuduleError,
    ModuleDependencyNotFoundError: errors_1.ModuleDependencyNotFoundError,
    InvalidPluginError: errors_1.InvalidPluginError,
    RootDirectoryNotExistError: errors_1.RootDirectoryNotExistError,
};
var metadata_1 = require("./utils/metadata");
exports.createMetadataHandlers = metadata_1.createMetadataHandlers;
var logger_1 = require("./utils/logger");
exports.LogLevel = logger_1.LogLevel;
var injex_1 = require("./injex");
exports.Injex = injex_1.default;
//# sourceMappingURL=index.js.map