import { IInjexPlugin, Injex } from "@injex/core";
import createConfig from "./createConfig";
import { IEnvPluginConfig } from "./interfaces";

export class EnvPlugin implements IInjexPlugin {

    private config: IEnvPluginConfig;

    constructor(config?: IEnvPluginConfig) {
        this.config = createConfig(config);
    }

    public async apply(container: Injex<any>): Promise<void> {
        const current = this.config.environments[this.config.current] || {}
            , defaults = this.config.defaults || {}
            , environment = { ...defaults, ...current };

        container.addObject(environment, "env");
    }
}