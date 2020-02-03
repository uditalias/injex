"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const metadata_1 = require("../utils/metadata");
function getDependencyName(item, name) {
    return name || utils_1.toCamelCase(Reflect.get(item, "name"));
}
function define(name) {
    return function (target) {
        metadata_1.setMetadata(target.prototype, "item", target);
        metadata_1.setMetadata(target.prototype, "name", getDependencyName(target, name));
    };
}
exports.define = define;
//# sourceMappingURL=define.js.map