import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";
import { collectMarkers } from "./markers";

/**
 * @singleton decorator - Marks a class to be instantiated once (singleton pattern)
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Marker-based approach)
 *
 * Singleton instances are created during bootstrap and reused throughout the app lifecycle.
 * This decorator also collects metadata markers from method decorators.
 *
 * @example
 * ```typescript
 * @define()
 * @singleton()
 * class MailService {
 *   // This class will only be instantiated once
 * }
 * ```
 */
export function singleton() {
    return function (targetConstructor: IConstructor, context: ClassDecoratorContext) {
        // TC39: Store metadata on the class
        metadataHandlers.setMetadata(targetConstructor, "singleton", true);

        // Collect markers from method decorators
        collectMarkers(targetConstructor, context.metadata);

        return targetConstructor;
    }
}
