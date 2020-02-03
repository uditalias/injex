"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
function singleton() {
    return function (target) {
        metadata_1.setMetadata(target.prototype, "singleton", true);
    };
}
exports.singleton = singleton;
//# sourceMappingURL=singleton.js.map