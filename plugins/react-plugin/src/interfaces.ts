import { AliasFactory, AliasMap, Injex } from "@injex/core";

export interface IReactPluginConfig {
    render(children: JSX.Element, container?: HTMLElement): void;
    rootElementOrSelector?: HTMLElement | string;
}

export interface IInjexContext {
    container: Injex<any>;
    inject: Inject;
    injectAlias: InjectAlias;
}

export type Inject = <T = any>(name: string) => T;
export type InjectAlias = <K extends string, V = any>(alias: string, keyBy: string) => AliasMap<K, V> | AliasFactory<K, V>
export type RenderInjexProvider = (children: JSX.Element, rootElement?: HTMLElement) => void;