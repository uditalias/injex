import { IInjexPlugin, Injex } from "@injex/core";
import createConfig from "./createConfig";
import { IEnvPluginConfig } from "./interfaces";

export class EnvPlugin implements IInjexPlugin {

    private config: IEnvPluginConfig;

    constructor(config?: IEnvPluginConfig) {
        this.config = createConfig(config);
    }

    public apply(container: Injex<any>) {
        const current = this.config.environments[this.config.current] || {};
        const defaults = this.config.defaults || {};
        const environment = { ...defaults, ...current };

        container.addObject(environment, this.config.name);
    }
}