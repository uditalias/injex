import { define, ILazyModule, lazy, singleton } from "@injex/core";
import { MyModule } from "./myModule.lazy";

/**
 * Example using a code-split lazy module using Injex
 * 1. Create a module loader like the following
 * 2. Create a module and exclude it's file name from the glob pattern (like in src/index.ts)
 * 3. Call the loader when you want to load the code like in the bootstrap file (src/bootstrap.ts)
 */
@lazy()
@define()
@singleton()
export class MyModuleLoader implements ILazyModule<MyModule> {
    public async import() {
        return (await import('./myModule.lazy')).MyModule;
    }
}