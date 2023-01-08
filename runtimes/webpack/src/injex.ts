import { Injex, LogLevel } from "@injex/core";
import { yieldToMain } from "@injex/stdlib";
import { RemoteModulesError } from "./errors";
import { IWebpackContainerConfig } from "./interfaces";

export default class InjexWebpack extends Injex<IWebpackContainerConfig> {

    public static create(config?: IWebpackContainerConfig): InjexWebpack {
        return new InjexWebpack(config);
    }

    protected createConfig(config: IWebpackContainerConfig): IWebpackContainerConfig {
        return {
            logLevel: LogLevel.Error,
            logNamespace: "Injex",
            plugins: [],
            ...config
        };
    }

    private async _handleRemoteLoader(loader: () => Promise<any[]>): Promise<void> {
        let modules: any[];
        try {
            modules = await loader();
        } catch (e) {
            this.logger.error(e);
            throw new RemoteModulesError();
        }

        if (modules?.length) {
            let start = performance.now() + 50;

            while (modules.length) {
                const remoteModule = modules.shift();
                this.addModule(remoteModule);

                if (performance.now() >= start) {
                    await yieldToMain();
                    start = performance.now() + 50;
                }
            }
        }
    }

    public async loadRemoteModules(...loaders: (() => Promise<any[]>)[]): Promise<void | void[]> {
        const promises = [];
        loaders = Array.prototype.slice.call(loaders);
        while (loaders.length) {
            const loader = loaders.shift();

            promises.push(
                this._handleRemoteLoader(loader)
            );
        }

        return Promise.all(promises);
    }

    protected async loadContainerFiles(): Promise<void> {
        await yieldToMain();

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

        if (this.config.perfMode) {
            let start = performance.now() + 50;
            while (allContextFiles.length) {
                const filePath = allContextFiles.shift();
                this.registerModuleExports(requireContext(filePath));

                if (performance.now() >= start) {
                    await yieldToMain();
                    start = performance.now() + 50;
                }
            }
        } else {
            allContextFiles.forEach((filePath) => this.registerModuleExports(requireContext(filePath)));
        }
    }
}