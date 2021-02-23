import { bootstrap, IBootstrap, inject } from "@injex/core";
import IShape from "interfaces/IShape";
import { ButtonManager } from 'managers/buttonManager';
import { ClockManager } from "./managers/clockManager";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private clockManager: ClockManager;
    @inject() private buttonManager: ButtonManager;
    @inject() private createShape: () => Promise<IShape>;

    public async run() {
        const $root = document.getElementById("root");
        const buttonView = this.buttonManager.getButtonView();

        $root.innerHTML = buttonView.render({
            text: this.clockManager.getTime()
        });

        const shape = await this.createShape();

        $root.appendChild(shape.draw());
    }
}