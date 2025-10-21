import metadataHandlers from "../metadataHandlers";
import { bootstrapSymbol } from "../constants";
import { IConstructor } from "@injex/stdlib";
import { collectMarkers } from "./markers";

/**
 * @bootstrap decorator - Marks a class as the bootstrap/entry point of the application
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Marker-based approach)
 *
 * The bootstrap class is automatically instantiated and its `run()` method is called
 * after all modules are initialized. Only one bootstrap class should exist per container.
 *
 * Bootstrap classes are automatically singletons.
 * This decorator also collects metadata markers from method decorators.
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

        // Collect markers from method decorators
        collectMarkers(targetConstructor, context.metadata);

        return targetConstructor;
    }
}
