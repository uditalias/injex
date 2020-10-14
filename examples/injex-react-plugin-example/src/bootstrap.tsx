import * as React from "react";
import { bootstrap, IBootstrap, inject } from "@injex/core";
import { AuthManager } from "managers/authManager";
import { RenderInjexProvider } from "@injex/react-plugin";
import App from "components/app";
import "styles/main.scss";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private authManager: AuthManager;
    @inject() private renderInjexProvider: RenderInjexProvider;

    public run() {
        this.authManager.initialize();
        this.renderInjexProvider(<App />);
    }
}