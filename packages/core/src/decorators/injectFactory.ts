import { registerFieldMetadata } from "./fieldRegistry";

/**
 * @injectFactory decorator - Injects a factory function for creating instances
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Hybrid approach)
 *
 * Injects a factory function that creates new instances each time it's called.
 * Useful for creating multiple instances of a non-singleton class.
 *
 * @param dependencyNameOrType - Optional: dependency name (string) or class constructor
 *
 * @example
 * ```typescript
 * @define()
 * class Rectangle implements IShape {
 *   // Not a singleton - each call creates a new instance
 * }
 *
 * @define()
 * @singleton()
 * class ShapeManager {
 *   // Inject factory function
 *   @injectFactory(Rectangle)
 *   private createRectangle: () => Rectangle;
 *
 *   public makeShapes() {
 *     const rect1 = this.createRectangle();
 *     const rect2 = this.createRectangle();
 *     // rect1 !== rect2 (different instances)
 *   }
 * }
 * ```
 */
export function injectFactory(dependencyNameOrType?: any) {
    return function (value: undefined, context: ClassFieldDecoratorContext) {
        // TC39: Get the field name from context
        const fieldName = String(context.name);

        // Store field metadata in context.metadata for later collection
        registerFieldMetadata(context.metadata, 'factoryDependency', {
            label: fieldName,
            value: dependencyNameOrType || fieldName
        });

        // Don't return an initializer - injection happens via property descriptors later
    }
}
