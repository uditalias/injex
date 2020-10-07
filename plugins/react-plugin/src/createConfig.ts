import * as ReactDOM from "react-dom";
import { IReactPluginConfig } from "./interfaces";

export default function createConfig(config?: Partial<IReactPluginConfig>): IReactPluginConfig {
    return {
        render: ReactDOM.render,
        rootElementOrSelector: null,
        ...config,
    };
}