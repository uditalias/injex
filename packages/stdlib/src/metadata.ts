/**
 * TC39 Decorator Metadata System for Injex v5
 *
 * This metadata system is designed to work with TC39 decorators (TypeScript 5.0+)
 * using the standard Symbol.metadata instead of the old WeakMap approach.
 */

export type MetadataHandlers<T> = {
    ensureMetadata: (target: any) => T;
    setMetadata: (target: any, key: keyof T, value: any) => void;
    getMetadata: (target: any) => T;
    hasMetadata: (target: any) => boolean;
    pushMetadata: (target: any, key: keyof T, value: any) => void;
    forEachProtoMetadata: (target: any, callback: (proto: object, metadata: T) => void) => void;
}

/**
 * Creates metadata handlers for TC39 decorators using Symbol.metadata.
 *
 * TC39 decorators attach metadata to classes via Symbol.metadata, which is
 * a well-known symbol that provides a standardized location for decorator metadata.
 *
 * @param metadataKey - A unique symbol to namespace our metadata within Symbol.metadata
 * @returns MetadataHandlers object with utility functions
 */
export function createMetadataHandlers<T = any>(metadataKey: symbol): MetadataHandlers<T> {

    /**
     * Ensures that metadata exists on the target, initializing if necessary.
     * For TC39 decorators, this works with Symbol.metadata on the class.
     */
    function ensureMetadata(target): T {
        if (!hasMetadata(target)) {
            // TC39 decorators: metadata is stored on Symbol.metadata
            if (!target[Symbol.metadata]) {
                target[Symbol.metadata] = {};
            }
            if (!target[Symbol.metadata][metadataKey]) {
                target[Symbol.metadata][metadataKey] = {} as T;
            }
        }

        return getMetadata(target);
    }

    /**
     * Sets a metadata value for a specific key on the target.
     */
    function setMetadata(target: any, key: keyof T, value: any) {
        const metadata = ensureMetadata(target);
        metadata[key] = value;
    }

    /**
     * Retrieves metadata from the target.
     * Returns undefined if no metadata exists.
     */
    function getMetadata(target): T {
        return target?.[Symbol.metadata]?.[metadataKey];
    }

    /**
     * Checks if metadata exists on the target.
     */
    function hasMetadata(target): boolean {
        return !!(target?.[Symbol.metadata]?.[metadataKey]);
    }

    /**
     * Pushes a value onto a metadata array.
     * If the key doesn't exist, it creates a new array first.
     */
    function pushMetadata(target: any, key: keyof T, value: any) {
        const metadata = ensureMetadata(target);

        if (!metadata[key]) {
            setMetadata(target, key, []);
        }

        (metadata[key] as any).push(value);
    }

    /**
     * Iterates through the prototype chain, calling the callback for each
     * prototype that has metadata.
     *
     * This is crucial for inheritance support - child classes need to access
     * metadata from parent classes.
     */
    function forEachProtoMetadata(target: any, callback: (proto: object, metadata: T) => void) {
        let __proto__ = target?.__proto__;
        while (__proto__) {
            const meta = getMetadata(__proto__);

            if (meta) {
                callback(__proto__, meta);
            }

            __proto__ = __proto__.__proto__;
        }
    }

    return {
        ensureMetadata,
        setMetadata,
        getMetadata,
        hasMetadata,
        pushMetadata,
        forEachProtoMetadata,
    };
}
