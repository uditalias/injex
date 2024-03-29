import { IInjexPlugin, Injex } from '@injex/core';
import * as React from "react";
import createConfig from "./createConfig";
import InjexProvider from "./InjexProvider";
import { IReactPluginConfig } from "./interfaces";
import { createRoot } from "react-dom/client";

export class ReactPlugin implements IInjexPlugin {

    private container: Injex<any>;
    private config: IReactPluginConfig;

    constructor(config?: IReactPluginConfig) {
        this._render = this._render.bind(this);
        this.config = createConfig(config);
    }

    public apply(container: Injex<any>): void | Promise<void> {
        this.container = container;
        container.addObject(this._render, "renderInjexProvider");
    }

    private _render(children: JSX.Element, rootElement?: HTMLElement) {
        let root = rootElement;

        if (!root) {
            const { rootElementOrSelector } = this.config;

            if (typeof rootElementOrSelector === "string") {
                root = document.querySelector(rootElementOrSelector);
            } else {
                root = rootElementOrSelector;
            }
        }

        const provider = (
            <InjexProvider container={this.container}>
                {children}
            </InjexProvider>
        );

        if (this.config.render) {
            this.config.render(provider, root);
        } else {
            createRoot(root).render(provider);
        }
    }
}