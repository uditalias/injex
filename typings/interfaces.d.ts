import { LogLevel } from "./utils/logger";
import { Injex } from ".";
import { SyncHook } from "tapable";
export declare type ModuleName = string | symbol;
export interface IModule {
    metadata: IDefinitionMetadata;
    module: any;
}
export interface IDependency {
    label: any;
    value: any;
}
export interface IContainerConfig {
    baseUrl?: string;
    rootDirs?: string[];
    logLevel?: LogLevel;
    logNamespace?: string;
    globPattern?: string;
    plugins?: IInjexPlugin[];
}
export interface IDefinitionMetadata {
    item: any;
    name?: ModuleName;
    singleton?: boolean;
    dependencies?: IDependency[];
    initMethod?: string;
    bootstrap?: boolean;
}
export interface IBootstrap {
    run(): Promise<void> | void;
}
export interface IInjexPlugin {
    apply(container: Injex): Promise<void>;
}
export interface IDictionary<T = any> {
    [index: string]: T;
}
export interface IInjexHooks {
    beforeRegistration: SyncHook;
    afterRegistration: SyncHook;
    beforeCreateModules: SyncHook;
    afterModuleCreation: SyncHook<IModule>;
    afterCreateModules: SyncHook;
    beforeModuleRequire: SyncHook<string>;
    afterModuleRequire: SyncHook<string, any>;
    berforeCreateInstance: SyncHook<Constructor, any[]>;
}
export declare type Constructor<T = any> = new () => T;
