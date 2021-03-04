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

export interface IAliasDependency {
    label: string;
    alias: string;
    keyBy: string;
}

export interface IDefinitionMetadata {
    item: any;
    name?: ModuleName;
    singleton?: boolean;
    dependencies?: IDependency[];
    aliasDependencies?: IAliasDependency[];
    aliases?: string[];
    initMethod?: string;
    bootstrap?: boolean;
    lazy?: boolean;
    lazyLoader?: ILazyModule<any>;
}

export interface IBootstrap {
    run(): Promise<void> | void;
    didCatch?(e: Error): void
}

export interface IInjexPlugin<T extends IContainerConfig = any> {
    apply(container: Injex<T>): void | Promise<void>;
}

export interface IInjexHooks {
    beforeRegistration: Hook;
    afterRegistration: Hook;
    beforeCreateModules: Hook;
    afterModuleCreation: Hook<[IModule]>;
    afterCreateModules: Hook;
    beforeCreateInstance: Hook<[IConstructor, any[]]>;
    bootstrapRun: Hook;
    bootstrapError: Hook<[Error]>;
    bootstrapComplete: Hook;
}

export interface IContainerConfig {
    logLevel?: LogLevel;
    logNamespace?: string;
    plugins?: IInjexPlugin[];
}

export interface ILazyModule<T> {
    import(...args: any[]): Promise<IConstructor<T>>;
}

export type Factory<T> = (...args: any[]) => T;
export type AliasFactory<K extends string, T> = { [key in K]: (...args: any[]) => T };
export type AliasMap<K extends string, T> = { [key in K]: T };