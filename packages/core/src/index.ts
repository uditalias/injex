export { Logger, LogLevel } from "@injex/stdlib";
export { alias } from "./decorators/alias";
export { bootstrap } from "./decorators/bootstrap";
export { define } from "./decorators/define";
export { init } from "./decorators/init";
export { inject } from "./decorators/inject";
export { injectAlias } from "./decorators/injectAlias";
export { injectFactory } from "./decorators/injectFactory";
export { injectParams, type InjectParamConfig } from "./decorators/injectParams";
export { lazy } from "./decorators/lazy";
export { ready } from "./decorators/ready";
export { singleton } from "./decorators/singleton";
export * as errors from "./errors";
export { default as Injex } from "./injex";
export * from "./interfaces";

// BREAKING CHANGE in v5: @injectParam is removed (TC39 decorators don't support parameter decorators)
// Use @injectParams instead. See migration guide.
