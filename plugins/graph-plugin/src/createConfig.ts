import { IGraphPluginConfig } from "./interfaces";

export default function createConfig(config?: IGraphPluginConfig): IGraphPluginConfig {
    return {
        port: 4000,
        enabled: true,
        ...config
    };
}