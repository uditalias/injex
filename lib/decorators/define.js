"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const metadata_1 = require("../utils/metadata");
function getDependencyName(item, name) {
    return name || utils_1.toCamelCase(Reflect.get(item, "name"));
}
function define(name) {
    return function (targetConstructor) {
        metadata_1.default.setMetadata(targetConstructor, "item", targetConstructor);
        metadata_1.default.setMetadata(targetConstructor, "name", getDependencyName(targetConstructor, name));
    };
}
exports.define = define;
//# sourceMappingURL=define.js.map