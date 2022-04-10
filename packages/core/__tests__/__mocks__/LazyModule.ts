import { define, singleton } from "../../src";

@define()
@singleton()
export class LazyModule {

    public sayHello(): string {
        return "I'm a lazy module!";
    }
}