import { IReactPluginConfig } from "./interfaces";

export default function createConfig(config?: Partial<IReactPluginConfig>): IReactPluginConfig {
    return {
        rootElementOrSelector: null,
        ...config,
    };
}