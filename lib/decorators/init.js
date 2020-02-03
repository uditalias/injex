"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
function init() {
    return function (target, methodName) {
        metadata_1.setMetadata(target, "initMethod", methodName);
    };
}
exports.init = init;
//# sourceMappingURL=init.js.map