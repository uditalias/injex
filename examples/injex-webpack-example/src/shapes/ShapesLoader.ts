import { define, ILazyModule, init, inject, lazy } from "@injex/core";
import { Shape } from "common/enums";
import IEnvironment from "interfaces/IEnvironment";

@lazy()
@define("createShape")
export class ShapesLoader implements ILazyModule<any> {
    @inject() private env: IEnvironment;

    public async import(): Promise<any> {
        switch (this.env.shape) {
            case Shape.Circle:
                return (await import('./Circle.mdl')).Circle;
            case Shape.Rectangle:
                return (await import('./Rectangle.mdl')).Rectangle;
        }
    }
}