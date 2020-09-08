import { Injex, LogLevel } from "@injex/core";
import { IWebpackContainerConfig } from "./interfaces";

export default class InjexWebpack extends Injex<IWebpackContainerConfig> {

    public static create(config: IWebpackContainerConfig): InjexWebpack {
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

        requireContext
            .keys()
            .forEach((filePath) => this.registerModuleExports(requireContext(filePath)));
    }
}