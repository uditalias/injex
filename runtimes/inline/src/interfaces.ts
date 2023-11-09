import { IContainerConfig } from "@injex/core";

export interface IInlineContainerConfig extends Partial<IContainerConfig> {
    modules: any[];
}