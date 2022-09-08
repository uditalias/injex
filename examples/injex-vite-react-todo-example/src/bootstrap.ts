import { bootstrap, IBootstrap, inject } from "@injex/core";
import { ViewManager } from "./view/viewManager";

@bootstrap()
export class Bootstrap implements IBootstrap {
    @inject() private viewManager: ViewManager;

    public run() {
        this.viewManager.render();
    }
}