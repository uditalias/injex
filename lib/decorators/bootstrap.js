"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
const constants_1 = require("../constants");
function bootstrap() {
    return function (targetConstructor) {
        metadata_1.setMetadata(targetConstructor, "name", constants_1.bootstrapSymbol);
        metadata_1.setMetadata(targetConstructor, "bootstrap", true);
        metadata_1.setMetadata(targetConstructor, "singleton", true);
    };
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map