import { define, init } from "@injex/core";

@define()
export class Rectangle {

    @init()
    protected initialize() {
        console.log("Rectangle created!");
    }

    public draw() {
        const rectangle = document.createElement('div');
        rectangle.style.backgroundColor = 'blue';
        rectangle.style.width = '100px';
        rectangle.style.height = '100px';
        return rectangle;
    }
}