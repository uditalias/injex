"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
function inject(dependencyNameOrType) {
    return function (targetPrototype, dependency) {
        metadata_1.default.pushMetadata(targetPrototype.constructor, "dependencies", {
            label: dependency,
            value: dependencyNameOrType || dependency
        });
    };
}
exports.inject = inject;
//# sourceMappingURL=inject.js.map