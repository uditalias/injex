import { IContainerConfig } from "@injex/core";

export interface RequireContext {
    keys(): string[];
    (id: string): any;
    <T>(id: string): T;
    resolve(id: string): string;
    id: string;
}

export interface IWebpackContainerConfig extends Partial<IContainerConfig> {
    resolveContext(): RequireContext;

    /**
     * Separate each require(module) to a separate task to prevent
     * long task while loading the container modules.
     *
     * @type Boolean
     * @default false
     */
    asyncModuleRequire?: boolean;
}