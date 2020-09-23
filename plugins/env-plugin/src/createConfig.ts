import { IEnvPluginConfig } from "./interfaces";

export default function createConfig(config?: Partial<IEnvPluginConfig>): IEnvPluginConfig {
    return {
        name: "env",
        current: process.env.NODE_ENV,
        defaults: {},
        environments: {},
        ...config,
    };
}