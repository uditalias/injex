import { Injex, LogLevel } from "@injex/core";
import { yieldToMain } from "@injex/stdlib";
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

        while (allContextFiles.length) {
            const filePath = allContextFiles.shift();
            this.registerModuleExports(requireContext(filePath));

            await yieldToMain();
        }
    }
}