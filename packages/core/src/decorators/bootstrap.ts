import metadataHandlers from "../metadataHandlers";
import { bootstrapSymbol } from "../constants";
import { IConstructor } from "@injex/stdlib";

/**
 * @bootstrap decorator - Marks a class as the bootstrap/entry point of the application
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
 *
 * The bootstrap class is automatically instantiated and its `run()` method is called
 * after all modules are initialized. Only one bootstrap class should exist per container.
 *
 * Bootstrap classes are automatically singletons.
 *
 * @example
 * ```typescript
 * @bootstrap()
 * class Bootstrap implements IBootstrap {
 *   @inject() private mailService: MailService;
 *
 *   public run() {
 *     // Application entry point
 *   }
 * }
 * ```
 */
export function bootstrap() {
    return function (targetConstructor: IConstructor, context: ClassDecoratorContext) {
        // TC39: Store metadata on the class
        metadataHandlers.setMetadata(targetConstructor, "item", targetConstructor);
        metadataHandlers.setMetadata(targetConstructor, "name", bootstrapSymbol);
        metadataHandlers.setMetadata(targetConstructor, "bootstrap", true);
        metadataHandlers.setMetadata(targetConstructor, "singleton", true);

        return targetConstructor;
    }
}
