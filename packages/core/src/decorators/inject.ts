import { metadataSymbol } from "../metadataHandlers";

/**
 * @inject decorator - Injects a dependency into a class field
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
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

        // TC39: Store in context.metadata, which becomes Class[Symbol.metadata]
        // Initialize metadata structure if needed
        if (!(context.metadata as any)[metadataSymbol]) {
            (context.metadata as any)[metadataSymbol] = {};
        }
        if (!(context.metadata as any)[metadataSymbol].dependencies) {
            (context.metadata as any)[metadataSymbol].dependencies = [];
        }

        // Store dependency information
        (context.metadata as any)[metadataSymbol].dependencies.push({
            label: fieldName,
            value: dependencyNameOrType || fieldName
        });

        // Don't return an initializer - injection happens via property descriptors later
    }
}

// Re-export the metadata symbol so it can be accessed by the metadata handlers
export { metadataSymbol };
