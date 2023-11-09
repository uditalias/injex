import { Injex, LogLevel } from "@injex/core";
import { IInlineContainerConfig } from "./interfaces";

export default class InjexInline extends Injex<IInlineContainerConfig> {

    public static create(config?: IInlineContainerConfig): InjexInline {
        return new InjexInline(config);
    }

    protected createConfig(config?: IInlineContainerConfig) {
        return {
            logLevel: LogLevel.Error,
            logNamespace: "Injex",
            plugins: [],
            ...config
        };
    }

    protected loadContainerFiles(): void {
        this.config.modules.forEach((mdl) => {
            this.registerModuleExports({ [mdl.name]: mdl })
        });
    }
}