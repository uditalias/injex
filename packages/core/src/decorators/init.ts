import metadataHandlers from "../metadataHandlers";

/**
 * @init decorator - Marks a method to be called during module initialization
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Hybrid approach)
 *
 * The init method is called after the module is instantiated and dependencies are injected,
 * but before the module is marked as ready. Multiple init methods can exist (including in parent classes),
 * and they'll be called from parent to child.
 *
 * Init methods can be async - the container will wait for them to complete.
 *
 * @example
 * ```typescript
 * @define()
 * @singleton()
 * class MailService {
 *   @inject() private config: ConfigService;
 *
 *   @init()
 *   public initialize() {
 *     // Called after dependencies are injected
 *     console.log("MailService initializing with config:", this.config);
 *   }
 *
 *   @init()
 *   public async loadTemplates() {
 *     // Async init methods are awaited
 *     this.templates = await this.config.loadTemplates();
 *   }
 * }
 * ```
 */
export function init() {
    return function (target: any, context: ClassMethodDecoratorContext) {
        // TC39: Get the method name from context
        const methodName = String(context.name);

        // Use addInitializer to store metadata when the class is defined
        context.addInitializer(function(this: any) {
            // For method decorators, initializers run per-instance
            // 'this' is the instance, so we need to get the constructor
            const targetClass = this.constructor;
            metadataHandlers.setMetadata(targetClass, "initMethod", methodName);
        });

        // Return the method unchanged
        return target;
    }
}
