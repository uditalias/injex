import { bootstrap, IBootstrap, inject } from "@injex/core";
import { Shape } from "common/enums";
import IShape from "interfaces/IShape";
import { ButtonManager } from 'managers/buttonManager';
import { Circle } from "shapes/Circle";
import { Rectangle } from "shapes/Rectangle";
import { ClockManager } from "./managers/clockManager";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private clockManager: ClockManager;
    @inject() private buttonManager: ButtonManager;
    @inject(Rectangle) private createRectangle: () => IShape;
    @inject(Circle) private createCircle: () => IShape;

    public run() {
        const $root = document.getElementById("root");
        const buttonView = this.buttonManager.getButtonView();

        $root.innerHTML = buttonView.render({
            text: this.clockManager.getTime()
        });

        const circle = this.createCircle();
        const rectangle = this.createRectangle();

        $root.appendChild(circle.draw());
        $root.appendChild(rectangle.draw());
    }
}