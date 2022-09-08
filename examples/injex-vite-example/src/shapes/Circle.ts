import { define, init } from "@injex/core";
import { BaseShape } from "./BaseShape";

@define()
export class Circle extends BaseShape {

    public get name(): string {
        return "Circle";
    }

    @init()
    protected circleInitialize() {
        console.log("I'm a Circle, nice to meet you!");
    }

    public draw() {
        console.log(this.clockManager.getTime());
        const circle = document.createElement('div');
        circle.style.backgroundColor = 'red';
        circle.style.width = '100px';
        circle.style.height = '100px';
        circle.style.borderRadius = '100%';
        return circle;
    }
}