"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
const constants_1 = require("../constants");
function bootstrap() {
    return function (targetConstructor) {
        metadata_1.default.setMetadata(targetConstructor, "name", constants_1.bootstrapSymbol);
        metadata_1.default.setMetadata(targetConstructor, "bootstrap", true);
        metadata_1.default.setMetadata(targetConstructor, "singleton", true);
    };
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map