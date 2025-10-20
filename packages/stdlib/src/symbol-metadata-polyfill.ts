/**
 * Polyfill for Symbol.metadata
 *
 * TC39 Decorators spec introduces Symbol.metadata as a well-known symbol
 * for storing decorator metadata. This polyfill adds support for engines
 * that don't have it natively.
 *
 * @see https://github.com/tc39/proposal-decorators
 */

// Check if Symbol.metadata already exists
if (typeof Symbol.metadata === 'undefined') {
    // Create the metadata symbol
    (Symbol as any).metadata = Symbol.for('Symbol.metadata');
}

// Export for use in other modules
export const SymbolMetadata = Symbol.metadata;
