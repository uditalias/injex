"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const colors_1 = require("./colors");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 0] = "Error";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Debug"] = 3] = "Debug";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Decorates a logger method, once it get's called,
 * check if it allowed and invoke it.
 *
 * @param level - The highest log level to allow
 */
function filterLogLevel(level) {
    return function (target, name, propertyDescriptor) {
        const originalFn = propertyDescriptor.value;
        propertyDescriptor.value = function () {
            if (this.logLevel >= level) {
                originalFn.apply(this, arguments);
            }
        };
    };
}
class Logger {
    constructor(logLevel, namespace) {
        this.logLevel = logLevel;
        this.namespace = namespace;
    }
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
        return this;
    }
    setNamespace(namespace) {
        this.namespace = namespace;
        return this;
    }
    info(...args) {
        this.invokeLogMethos("info", args, colors_1.Colors.FgCyan);
    }
    debug(...args) {
        this.invokeLogMethos("debug", args, colors_1.Colors.FgGreen);
    }
    warn(...args) {
        this.invokeLogMethos("warn", args, colors_1.Colors.FgYellow);
    }
    error(...args) {
        this.invokeLogMethos("error", args, colors_1.Colors.FgRed);
    }
    invokeLogMethos(method, args, color) {
        args = [
            `\x1b[2m${(new Date()).toLocaleTimeString()}\x1b[0m ${color}[${method.toUpperCase()}]\x1b[0m ${this.namespace}:`,
            ...Array.from(args)
        ];
        console[method](...args);
    }
}
tslib_1.__decorate([
    filterLogLevel(LogLevel.Info),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Logger.prototype, "info", null);
tslib_1.__decorate([
    filterLogLevel(LogLevel.Debug),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Logger.prototype, "debug", null);
tslib_1.__decorate([
    filterLogLevel(LogLevel.Warn),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Logger.prototype, "warn", null);
tslib_1.__decorate([
    filterLogLevel(LogLevel.Error),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Logger.prototype, "error", null);
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map