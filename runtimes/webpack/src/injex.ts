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
            plugins: [],
            ...config
        };
    }

    protected loadContainerFiles(): void {
        const requireContext = this.config.resolveContext();
        const allContextFiles = requireContext.keys().reduce((files, currentFile) => {
            // webpack v5 has a breaking change when the 'requireContext.keys()' may have duplications
            // https://github.com/webpack/webpack/issues/12087
            currentFile = currentFile.replace(/^.\//, "");
            return files.includes(currentFile) ? files : files.concat(currentFile);
        }, []);

        allContextFiles.forEach((filePath) => this.registerModuleExports(requireContext(filePath)));
    }
}