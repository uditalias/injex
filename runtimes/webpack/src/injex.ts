import { Injex, LogLevel } from "@injex/core";
import { IWebpackContainerConfig } from "./interfaces";

export default class InjexWebpack extends Injex<IWebpackContainerConfig> {

    public static create(config?: IWebpackContainerConfig): InjexWebpack {
        return new InjexWebpack(config);
    }

    protected createConfig(config: IWebpackContainerConfig): IWebpackContainerConfig {
        return {
            logLevel: LogLevel.Error,
            logNamespace: "Injex",
            asyncModuleRequire: false,
            plugins: [],
            ...config
        };
    }

    protected loadContainerFiles(): Promise<void> {
        // using a timeout to allow the loading process start
        // fresh on a new javascript task in order to prevent
        // long task.
        return new Promise((resolve) => setTimeout(() => {
            const requireContext = this.config.resolveContext();
            const loadedModules = {};
            const allContextFiles = requireContext.keys().reduce((files, currentFile) => {
                // webpack v5 has a breaking change when the 'requireContext.keys()' may have duplications
                // https://github.com/webpack/webpack/issues/12087
                if (loadedModules[currentFile]) {
                    return files;
                }

                loadedModules[currentFile] = true;
                loadedModules[currentFile.replace(/^\.\//, '')] = true;
                return files.concat(currentFile);
            }, []);

            if (this.config.asyncModuleRequire) {
                const registrationPromises: Promise<void>[] = [];
                allContextFiles.forEach((filePath) => {
                    registrationPromises.push(
                        new Promise((r) => {
                            setTimeout(() => {
                                this.registerModuleExports(requireContext(filePath));
                                r();
                            })
                        })
                    );
                });

                Promise.all(registrationPromises).then(() => resolve());
            } else {
                allContextFiles.forEach((filePath) => this.registerModuleExports(requireContext(filePath)));
                resolve();
            }
        }, 0));
    }
}