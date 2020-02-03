"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
function inject(dependencyNameOrType) {
    return function (target, dependency) {
        metadata_1.pushMetadata(target, "dependencies", {
            label: dependency,
            value: dependencyNameOrType || dependency
        });
    };
}
exports.inject = inject;
//# sourceMappingURL=inject.js.map