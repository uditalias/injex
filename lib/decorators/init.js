"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
function init() {
    return function (targetPrototype, methodName) {
        metadata_1.default.setMetadata(targetPrototype.constructor, "initMethod", methodName);
    };
}
exports.init = init;
//# sourceMappingURL=init.js.map