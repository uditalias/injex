import { registerFieldMetadata } from "./fieldRegistry";

/**
 * @inject decorator - Injects a dependency into a class field
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Field registry approach)
 *
 * Automatically injects the specified dependency. Can inject by:
 * - Type inference (when no parameter provided)
 * - Explicit type (when class constructor provided)
 * - Name (when string provided)
 *
 * Uses context.metadata to store field info, which is then collected by class decorators.
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

        // Store field metadata in context.metadata for later collection
        // Even though Symbol.metadata isn't used at runtime, context.metadata exists
        registerFieldMetadata(context.metadata, 'dependency', {
            label: fieldName,
            value: dependencyNameOrType || fieldName
        });

        // Don't return an initializer - injection happens via property descriptors later
    }
}
