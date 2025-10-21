import { registerFieldMetadata } from "./fieldRegistry";

/**
 * @injectAlias decorator - Injects all modules registered under a specific alias
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Hybrid approach)
 *
 * Injects a collection of all modules that share the same alias.
 * The injected value is an AliasMap that can be iterated or accessed by key.
 *
 * @param alias - The alias name to inject
 * @param keyBy - Optional: property name to use as key in the map
 *
 * @example
 * ```typescript
 * // Define modules with aliases
 * @define()
 * @singleton()
 * @alias("IMailProvider")
 * class SmtpProvider implements IMailProvider {
 *   readonly type = "smtp";
 * }
 *
 * @define()
 * @singleton()
 * @alias("IMailProvider")
 * class SendGridProvider implements IMailProvider {
 *   readonly type = "sendgrid";
 * }
 *
 * // Inject all providers
 * @define()
 * @singleton()
 * class MailService {
 *   // Inject all IMailProvider instances, keyed by 'type' property
 *   @injectAlias("IMailProvider", "type")
 *   private providers: AliasMap<string, IMailProvider>;
 *
 *   public sendEmail() {
 *     const smtp = this.providers.get("smtp");
 *     const sendgrid = this.providers.get("sendgrid");
 *   }
 * }
 * ```
 */
export function injectAlias(alias: string, keyBy?: string) {
    return function (value: undefined, context: ClassFieldDecoratorContext) {
        // TC39: Get the field name from context
        const fieldName = String(context.name);

        // Store field metadata in context.metadata for later collection
        registerFieldMetadata(context.metadata, 'aliasDependency', {
            label: fieldName,
            alias,
            keyBy
        });

        // Don't return an initializer - injection happens via property descriptors later
    }
}
