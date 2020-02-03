"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
function toCamelCase(str) {
    return str[0].toLowerCase() + str.slice(1);
}
exports.toCamelCase = toCamelCase;
function getAllFilesInDir(dir, pattern) {
    return glob.sync(`${dir}${pattern}`);
}
exports.getAllFilesInDir = getAllFilesInDir;
function isFunction(predicate) {
    return typeof predicate === "function";
}
exports.isFunction = isFunction;
//# sourceMappingURL=utils.js.map