export type MetadataHandlers<T> = {
    ensureMetadata: (target: any) => T;
    setMetadata: (target: any, key: keyof T, value: any) => void;
    getMetadata: (target: any) => T;
    hasMetadata: (target: any) => boolean;
    pushMetadata: (target: any, key: keyof T, value: any) => void;
    forEachProtoMetadata: (target: any, callback: (proto: object, metadata: T) => void) => void;
}

const _metadata = new WeakMap();

export function createMetadataHandlers<T = any>(metadataKey: symbol): MetadataHandlers<T> {
    function ensureMetadata(target): T {
        if (!hasMetadata(target)) {
            _metadata.set(target, {
                [metadataKey]: {}
            });
        }

        return getMetadata(target);
    }

    function setMetadata(target: any, key: keyof T, value: any) {
        const metadata = ensureMetadata(target);
        metadata[key] = value;
    }

    function getMetadata(target): T {
        return _metadata.get(target)?.[metadataKey];
    }

    function hasMetadata(target): boolean {
        return _metadata.has(target);
    }

    function pushMetadata(target: any, key: keyof T, value: any) {
        const metadata = ensureMetadata(target);

        if (!metadata[key]) {
            setMetadata(target, key, []);
        }

        (metadata[key] as any).push(value);
    }

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