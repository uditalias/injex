import { IConstructor, toCamelCase } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";
import { collectMarkers } from "./markers";

function getDependencyName(item: any, name?: string): string {
    return name || toCamelCase(item.name);
}

/**
 * @define decorator - Registers a class as an injectable dependency
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Marker-based approach)
 *
 * This decorator also collects all metadata markers from method decorators
 * (@init, @ready, @injectParams) applied to the class.
 *
 * @param name - Optional custom name for the module (defaults to camelCase class name)
 *
 * @example
 * ```typescript
 * @define()
 * class MailService {}
 *
 * @define("customName")
 * class UserService {}
 * ```
 */
export function define(name?: string) {
    return function (targetConstructor: IConstructor, context: ClassDecoratorContext) {
        // TC39: Store basic metadata on the class
        metadataHandlers.setMetadata(targetConstructor, "item", targetConstructor);
        metadataHandlers.setMetadata(targetConstructor, "name", getDependencyName(targetConstructor, name));

        // Collect all markers from method decorators (@init, @ready, @injectParams)
        collectMarkers(targetConstructor, context.metadata);

        // TC39 decorators: return the class (or undefined for no modification)
        return targetConstructor;
    }
}
