import { IConstructor, toCamelCase } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

function getDependencyName(item: any, name?: string): string {
    return name || toCamelCase(item.name);
}

/**
 * @define decorator - Registers a class as an injectable dependency
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
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
        // TC39: Store metadata on the class using Symbol.metadata
        // Context.metadata will be merged into targetConstructor[Symbol.metadata]
        metadataHandlers.setMetadata(targetConstructor, "item", targetConstructor);
        metadataHandlers.setMetadata(targetConstructor, "name", getDependencyName(targetConstructor, name));

        // TC39 decorators: return the class (or undefined for no modification)
        return targetConstructor;
    }
}
