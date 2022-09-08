import { IContainerConfig } from "@injex/core";

export interface IViteContainerConfig extends Partial<IContainerConfig> {
    glob: () => { [index: string]: () => any; };
}