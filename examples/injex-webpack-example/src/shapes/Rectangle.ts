import { define } from "@injex/core";
import { BaseShape } from "./BaseShape";

@define()
export class Rectangle extends BaseShape {

    public get name(): string {
        return "Rectangle";
    }

    public draw() {
        console.log(this.clockManager.getTime());
        const rectangle = document.createElement('div');
        rectangle.style.backgroundColor = 'blue';
        rectangle.style.width = '100px';
        rectangle.style.height = '100px';
        return rectangle;
    }
}