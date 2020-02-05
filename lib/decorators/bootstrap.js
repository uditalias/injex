"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
const constants_1 = require("../constants");
function bootstrap() {
    return function (target) {
        metadata_1.setMetadata(target.prototype, "name", constants_1.bootstrapSymbol);
        metadata_1.setMetadata(target.prototype, "bootstrap", true);
        metadata_1.setMetadata(target.prototype, "singleton", true);
    };
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map