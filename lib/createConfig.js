"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const path = require("path");
function createConfig(config = {}) {
    return {
        logLevel: _1.LogLevel.Error,
        rootDirs: [
            path.resolve(process.cwd(), "./src")
        ],
        logNamespace: "Injex",
        globPattern: "/**/*.js",
        plugins: [],
        ...config
    };
}
exports.default = createConfig;
//# sourceMappingURL=createConfig.js.map