import { init, inject } from "@injex/core";
import IShape from "interfaces/IShape";
import { ClockManager } from "managers/clockManager";

export abstract class BaseShape implements IShape {
    @inject() protected clockManager: ClockManager;

    protected abstract get name(): string;
    public abstract draw(): HTMLElement;

    @init()
    protected initialize() {
        console.log(`${this.name} created!`);
    }
}