"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../utils/metadata");
const colors_1 = require("../utils/colors");
class HooksLoggerPlugin {
    async apply(container) {
        container
            .hooks
            .berforeCreateInstance
            .tap(this.constructor.name, (construct, args = []) => {
            const metadata = metadata_1.default.getMetadata(construct);
            container.logger.debug(`${this.constructor.name} Creating instance: ${colors_1.Colors.FgCyan}${String(metadata.name)}${colors_1.Colors.Reset} with ${args.length ? 'args: ' : 'no args.'}${args}`);
        });
    }
}
exports.default = HooksLoggerPlugin;
//# sourceMappingURL=HooksLoggerPlugin.js.map