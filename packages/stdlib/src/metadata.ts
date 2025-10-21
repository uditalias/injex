/**
 * TC39 Decorator Metadata System for Injex v5 (Hybrid Approach)
 *
 * This metadata system uses TC39 decorator syntax but stores metadata in a WeakMap
 * instead of relying on Symbol.metadata (which TypeScript 5.x doesn't emit at runtime).
 *
 * This hybrid approach gives us:
 * - Modern TC39 decorator syntax
 * - Practical runtime metadata storage
 * - Future compatibility when Symbol.metadata is widely supported
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
 * Creates metadata handlers for TC39 decorators using a WeakMap.
 *
 * Unlike the full TC39 spec which uses Symbol.metadata, this implementation
 * uses a WeakMap to store metadata. This works with TypeScript 5.x transpilation
 * which doesn't emit Symbol.metadata at runtime.
 *
 * @param metadataKey - A unique symbol to namespace our metadata
 * @returns MetadataHandlers object with utility functions
 */
export function createMetadataHandlers<T = any>(metadataKey: symbol): MetadataHandlers<T> {
    // WeakMap to store metadata keyed by class constructor
    const _metadata = new WeakMap<any, { [key: symbol]: T }>();

    // WeakSet to track which classes have had their array metadata initialized
    // This prevents duplicate entries when initializers run multiple times
    const _initializedArrays = new WeakMap<any, Set<keyof T>>();

    /**
     * Ensures that metadata exists on the target, initializing if necessary.
     */
    function ensureMetadata(target: any): T {
        if (!hasMetadata(target)) {
            _metadata.set(target, {
                [metadataKey]: {} as T
            });
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
    function getMetadata(target: any): T {
        const metadataObj = _metadata.get(target);
        return metadataObj?.[metadataKey];
    }

    /**
     * Checks if metadata exists on the target.
     */
    function hasMetadata(target: any): boolean {
        return _metadata.has(target) && !!_metadata.get(target)?.[metadataKey];
    }

    /**
     * Pushes a value onto a metadata array.
     * If the key doesn't exist, it creates a new array first.
     *
     * Note: This function checks if the value was already pushed to prevent
     * duplicates when decorators' addInitializer callbacks run multiple times.
     */
    function pushMetadata(target: any, key: keyof T, value: any) {
        const metadata = ensureMetadata(target);

        if (!metadata[key]) {
            setMetadata(target, key, []);
        }

        // Get or create the set of initialized keys for this target
        if (!_initializedArrays.has(target)) {
            _initializedArrays.set(target, new Set());
        }

        const initializedKeys = _initializedArrays.get(target)!;
        const arrayKey = String(key);

        // Create a unique key for this specific value in this array
        const valueKey = `${arrayKey}:${JSON.stringify(value)}`;

        // Only push if we haven't seen this exact value before
        if (!initializedKeys.has(valueKey as keyof T)) {
            (metadata[key] as any).push(value);
            initializedKeys.add(valueKey as keyof T);
        }
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
            // Get metadata from the prototype's constructor
            const constructor = __proto__.constructor;
            const meta = constructor ? getMetadata(constructor) : undefined;

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
