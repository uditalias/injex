import { Injex, LogLevel } from "@injex/core";
import { INodeContainerConfig } from "./interfaces";
import { resolve } from "path";
import { getAllFilesInDir, isDirExists } from "./utils";
import { RootDirectoryNotExistError } from "./errors";

export default class InjexNode extends Injex<INodeContainerConfig> {

    public static create(config: INodeContainerConfig): InjexNode {
        return new InjexNode(config);
    }

    protected createConfig(config: Partial<INodeContainerConfig>): INodeContainerConfig {
        return {
            logLevel: LogLevel.Error,
            logNamespace: "Injex",
            plugins: [],
            rootDirs: [
                resolve(process.cwd(), "./src")
            ],
            globPattern: "/**/*.js",
            ...config
        };
    }

    protected loadContainerFiles(): void {
        this.config.rootDirs
            .map((dir) => (this._throwIfRootDirNotExists(dir), getAllFilesInDir(dir, this.config.globPattern)))
            .reduce((allFiles: string[], files: string[]) => allFiles.concat(files), [])
            .forEach((filePath) => this.registerModuleExports(require(filePath)));
    }

    private _throwIfRootDirNotExists(dir: string) {
        if (!isDirExists(dir)) {
            throw new RootDirectoryNotExistError(dir);
        }
    }
}