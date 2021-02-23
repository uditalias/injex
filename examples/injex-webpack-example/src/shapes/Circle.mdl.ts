import { define, init } from "@injex/core";

@define()
export class Circle {

    @init()
    protected initialize() {
        console.log("Circle created!");
    }

    public draw() {
        const circle = document.createElement('div');
        circle.style.backgroundColor = 'red';
        circle.style.width = '100px';
        circle.style.height = '100px';
        circle.style.borderRadius = '100%';
        return circle;
    }
}