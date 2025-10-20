import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

/**
 * @singleton decorator - Marks a class to be instantiated once (singleton pattern)
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
 *
 * Singleton instances are created during bootstrap and reused throughout the app lifecycle.
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

        return targetConstructor;
    }
}
