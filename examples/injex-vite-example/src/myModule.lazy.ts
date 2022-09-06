import { define, init, singleton } from "@injex/core";

/**
 * This is a lazy load module, loaded by myModuleLoader.ts
 */
@define()
@singleton()
export class MyModule {
    @init()
    protected initialize() {
        console.log('hello world!');
    }
}