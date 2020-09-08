import { IExpressPluginConfig } from "./interfaces";

// tslint:disable-next-line
export function noop(...args: any[]) { }

export default function createConfig(config?: Partial<IExpressPluginConfig>): IExpressPluginConfig {
    return {
        app: null,
        createAppCallback: noop,
        ...config
    };
}