import { Hook, IConstructor, LogLevel } from "@injex/stdlib";
import { Injex } from "./";

export type ModuleName = string | symbol;

export interface IModule {
    metadata: IDefinitionMetadata;
    module: any;
}

export interface IDependency {
    label: any;
    value: any;
}

export interface IAliasFactory {
    label: string;
    alias: string;
    keyBy: string;
}

export interface IDefinitionMetadata {
    item: any;
    name?: ModuleName;
    singleton?: boolean;
    dependencies?: IDependency[];
    aliasFactories?: IAliasFactory[];
    aliases?: string[];
    initMethod?: string;
    bootstrap?: boolean;
    lazy?: boolean;
}

export interface IBootstrap {
    run(): Promise<void> | void;
    didCatch?(e: Error): void
}

export interface IInjexPlugin<T extends IContainerConfig = any> {
    apply(container: Injex<T>): Promise<void>;
}

export interface IInjexHooks {
    beforeRegistration: Hook;
    afterRegistration: Hook;
    beforeCreateModules: Hook;
    afterModuleCreation: Hook<[module: IModule]>;
    afterCreateModules: Hook;
    berforeCreateInstance: Hook<[constructor: IConstructor, args: any[]]>;
}

export interface IContainerConfig {
    logLevel?: LogLevel;
    logNamespace?: string;
    plugins?: IInjexPlugin[];
}

export interface ILazyModule<T> {
    import(...args: any[]): Promise<IConstructor<T>>;
}

export type AliasFactory<T> = { [index: string]: () => T };