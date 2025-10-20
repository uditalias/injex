import { metadataSymbol } from "../metadataHandlers";

export interface InjectParamConfig {
    /**
     * The parameter index (0-based)
     */
    index: number;

    /**
     * The dependency name (string) or type (class constructor) to inject
     */
    value: any;
}

/**
 * @injectParams decorator - Injects dependencies into method parameters
 *
 * TC39 Decorator - Compatible with TypeScript 5.0+
 *
 * Since TC39 decorators don't support parameter decorators, this method decorator
 * provides an alternative by specifying which parameters to inject via configuration.
 *
 * **BREAKING CHANGE from v4:**
 * In v4, you used `@injectParam()` on individual parameters.
 * In v5, you use `@injectParams([...])` on the method itself.
 *
 * @param params - Array of parameter injection configurations
 *
 * @example
 * ```typescript
 * // v4 (experimental decorators):
 * public send(message: string, @injectParam() mailService: MailService) {}
 *
 * // v5 (TC39 decorators):
 * @injectParams([{ index: 1, value: MailService }])
 * public send(message: string, mailService: MailService) {}
 *
 * // Multiple parameters:
 * @injectParams([
 *   { index: 1, value: MailService },
 *   { index: 2, value: "logger" }
 * ])
 * public process(data: any, mailService: MailService, logger: Logger) {}
 * ```
 */
export function injectParams(params: InjectParamConfig[]) {
    return function (target: any, context: ClassMethodDecoratorContext) {
        // TC39: Get the method name from context
        const methodName = String(context.name);

        // TC39: Store in context.metadata
        if (!context.metadata[metadataSymbol]) {
            context.metadata[metadataSymbol] = {};
        }
        if (!context.metadata[metadataSymbol].paramDependencies) {
            context.metadata[metadataSymbol].paramDependencies = [];
        }

        // Store parameter dependency information for each parameter
        for (const param of params) {
            context.metadata[metadataSymbol].paramDependencies.push({
                methodName,
                index: param.index,
                label: `param_${param.index}`,  // Label for debugging
                value: param.value
            });
        }

        // Return the method unchanged
        return target;
    }
}
