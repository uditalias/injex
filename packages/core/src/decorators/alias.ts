import metadataHandlers from "../metadataHandlers";
import { IConstructor } from "@injex/stdlib";
import { collectMarkers } from "./markers";

/**
 * @alias decorator - Creates aliases for a class, allowing it to be injected by multiple names
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Marker-based approach)
 *
 * Aliases are useful for grouping related modules or implementing interfaces.
 * This decorator also collects metadata markers from method decorators.
 *
 * @param names - One or more alias names
 *
 * @example
 * ```typescript
 * @define()
 * @singleton()
 * @alias("IMailProvider", "EmailProvider")
 * class MailService {
 *   // Can be injected as MailService, IMailProvider, or EmailProvider
 * }
 *
 * @injectAlias("IMailProvider")
 * private providers: AliasMap<string, IMailProvider>;
 * ```
 */
export function alias(...names: string[]) {
    return function (targetConstructor: IConstructor, context: ClassDecoratorContext) {
        // TC39: Store metadata on the class
        for (let i = 0, len = names.length; i < len; i++) {
            metadataHandlers.pushMetadata(targetConstructor, "aliases", names[i]);
        }

        // Collect markers from method decorators
        collectMarkers(targetConstructor, context.metadata);

        return targetConstructor;
    }
}
