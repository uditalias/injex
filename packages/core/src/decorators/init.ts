import { metadataSymbol } from "../metadataHandlers";

/**
 * @init decorator - Marks a method to be called during module initialization
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
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

        // TC39: Store in context.metadata
        if (!(context.metadata as any)[metadataSymbol]) {
            (context.metadata as any)[metadataSymbol] = {};
        }

        // Store the init method name
        (context.metadata as any)[metadataSymbol].initMethod = methodName;

        // Return the method unchanged
        return target;
    }
}
