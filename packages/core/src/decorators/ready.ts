import { addMarker } from "./markers";

/**
 * @ready decorator - Marks a method to be called after bootstrap is complete
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+ (Marker-based approach)
 *
 * The ready method is called after all modules have been initialized and the
 * application bootstrap is complete. Multiple ready methods can exist (including in parent classes),
 * and they'll be called from parent to child.
 *
 * Ready methods can be async, though they're typically not awaited by the container.
 *
 * @example
 * ```typescript
 * @define()
 * @singleton()
 * class MailService {
 *   @inject() private config: ConfigService;
 *
 *   @init()
 *   public async initialize() {
 *     // Called first during bootstrap
 *     await this.loadConfig();
 *   }
 *
 *   @ready()
 *   public onReady() {
 *     // Called after all modules are initialized
 *     console.log("MailService is ready to send emails");
 *     this.startBackgroundJobs();
 *   }
 * }
 * ```
 */
export function ready() {
    return function (target: any, context: ClassMethodDecoratorContext) {
        // TC39: Get the method name from context
        const methodName = String(context.name);

        // Add marker to the method function itself
        // Class decorators will collect these markers
        addMarker(target, 'readyMethod', methodName);

        // Return the method unchanged
        return target;
    }
}
