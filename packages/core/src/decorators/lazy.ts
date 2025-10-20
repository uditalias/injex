import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

/**
 * @lazy decorator - Marks a class for lazy loading (loaded on-demand, not at bootstrap)
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
 *
 * Lazy modules are not instantiated during bootstrap. They're created only when
 * first requested. Lazy modules are automatically singletons.
 *
 * @example
 * ```typescript
 * @define()
 * @lazy()
 * class HeavyService implements ILazyModule<HeavyServiceImpl> {
 *   async import() {
 *     const { HeavyServiceImpl } = await import('./heavy-service-impl');
 *     return HeavyServiceImpl;
 *   }
 * }
 *
 * // Usage:
 * @inject() private heavyService: () => Promise<HeavyServiceImpl>;
 *
 * const service = await this.heavyService();
 * ```
 */
export function lazy() {
    return function (targetConstructor: IConstructor, context: ClassDecoratorContext) {
        // TC39: Store metadata on the class
        metadataHandlers.setMetadata(targetConstructor, "lazy", true);
        metadataHandlers.setMetadata(targetConstructor, "singleton", true);

        return targetConstructor;
    }
}
