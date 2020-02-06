"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
function createConfig(config) {
    return {
        logLevel: _1.LogLevel.Error,
        rootDirs: [
            process.cwd()
        ],
        logNamespace: "Container",
        globPattern: "/**/*.js",
        plugins: [],
        ...config
    };
}
exports.default = createConfig;
//# sourceMappingURL=createConfig.js.map