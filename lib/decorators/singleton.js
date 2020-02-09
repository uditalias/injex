"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
function singleton() {
    return function (targetConstructor) {
        metadata_1.default.setMetadata(targetConstructor, "singleton", true);
    };
}
exports.singleton = singleton;
//# sourceMappingURL=singleton.js.map