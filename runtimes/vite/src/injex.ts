import { Injex, LogLevel } from "@injex/core";
import { IViteContainerConfig } from "./interfaces";

export default class InjexVite extends Injex<IViteContainerConfig> {

    public static create(config?: IViteContainerConfig): InjexVite {
        return new InjexVite(config);
    }

    protected createConfig(config: IViteContainerConfig): IViteContainerConfig {
        return {
            logLevel: LogLevel.Error,
            logNamespace: "Injex",
            plugins: [],
            ...config
        };
    }

    protected loadContainerFiles(): Promise<void> {
        // using a timeout to allow the loading process start
        // fresh on a new javascript task in order to prevent
        // long task.
        return new Promise((resolve) => setTimeout(() => {
            const modules = this.config.glob();

            Object.keys(modules)
                .forEach((modulePath) => this.registerModuleExports(modules[modulePath]));

            resolve();
        }, 0));
    }
}