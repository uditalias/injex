import { bootstrap, IBootstrap, inject } from "@injex/core";
import IShape from './interfaces/IShape';
import { ButtonManager } from './managers/buttonManager';
import { ClockManager } from "./managers/clockManager";
import { MyModule } from "./myModule.lazy";
import { Circle } from './shapes/Circle';
import { Rectangle } from './shapes/Rectangle';

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private clockManager!: ClockManager;
    @inject() private buttonManager!: ButtonManager;
    @inject() myModuleLoader!: () => Promise<MyModule>;
    @inject(Rectangle) private createRectangle!: () => IShape;
    @inject(Circle) private createCircle!: () => IShape;

    public async run() {
        const $root = document.getElementById("root");
        const buttonView = this.buttonManager.getButtonView();

        // Loads MyModule and inject it into the Injex container
        this.myModuleLoader();

        if ($root !== null) {
            $root.innerHTML = buttonView.render({
                text: this.clockManager.getTime()
            });

            const circle = this.createCircle();
            const rectangle = this.createRectangle();

            $root.appendChild(circle.draw());
            $root.appendChild(rectangle.draw());
        }
    }
}