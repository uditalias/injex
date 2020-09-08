import { IContainerConfig } from "@injex/core";

export interface INodeContainerConfig extends Partial<IContainerConfig> {
    rootDirs?: string[];
    globPattern?: string;
}