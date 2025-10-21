import metadataHandlers from "../metadataHandlers";

/**
 * @inject decorator - Injects a dependency into a class field
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Hybrid approach)
 *
 * Automatically injects the specified dependency. Can inject by:
 * - Type inference (when no parameter provided)
 * - Explicit type (when class constructor provided)
 * - Name (when string provided)
 *
 * @param dependencyNameOrType - Optional: dependency name (string) or class constructor
 *
 * @example
 * ```typescript
 * @define()
 * @singleton()
 * class MailSender {
 *   // Inject by property name
 *   @inject() private mailService: MailService;
 *
 *   // Inject by explicit type
 *   @inject(MailService) private service: MailService;
 *
 *   // Inject by name
 *   @inject("mailService") private service: MailService;
 * }
 * ```
 */
export function inject(dependencyNameOrType?: any) {
    return function (value: undefined, context: ClassFieldDecoratorContext) {
        // TC39: Get the field name from context
        const fieldName = String(context.name);

        // Use addInitializer to store metadata when the class is defined
        context.addInitializer(function(this: any) {
            // For field decorators, initializers run per-instance
            // 'this' is the instance, so we need to get the constructor
            const targetClass = this.constructor;
            metadataHandlers.pushMetadata(targetClass, "dependencies", {
                label: fieldName,
                value: dependencyNameOrType || fieldName
            });
        });

        // Don't return an initializer - injection happens via property descriptors later
    }
}
