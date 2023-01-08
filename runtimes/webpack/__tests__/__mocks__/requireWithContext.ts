import { readdirSync } from "fs";
import { join } from "path";

export type RequireWithContext = {
    (path: string): any;
    context: (path: string, deep: boolean, filter: RegExp) => any;
};

export default function makeRequireWithContext(): RequireWithContext {
    const _require = require as any;

    _require.context = function RequireContext(path: string, deep: boolean, filter: RegExp) {
        const dir = readdirSync(path);

        const modules = [];
        while (dir.length) {
            const file = dir.shift();

            if (filter.test(file)) {
                modules.push(join(path, file));
            }
        }

        function req(path: string) {
            return require(path);
        }

        req.keys = () => modules;

        return req;
    }

    return _require;
}