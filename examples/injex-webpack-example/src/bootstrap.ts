import { bootstrap, IBootstrap, inject } from "@injex/core";
import { ButtonManager } from 'managers/buttonManager';
import { ClockManager } from "./managers/clockManager";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private clockManager: ClockManager;
    @inject() private buttonManager: ButtonManager;

    public run() {
        const $root = document.getElementById("root");
        const buttonView = this.buttonManager.getButtonView();

        $root.innerHTML = buttonView.render({
            text: this.clockManager.getTime()
        });
    }
}