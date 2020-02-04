"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
function bootstrap() {
    return function (target) {
        metadata_1.setMetadata(target.prototype, "bootstrap", true);
    };
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map