export type MetadataHandlers<T> = {
    ensureMetadata: (target: any) => T;
    setMetadata: (target: any, key: keyof T, value: any) => void;
    getMetadata: (target: any) => T;
    hasMetadata: (target: any) => boolean;
    pushMetadata: (target: any, key: keyof T, value: any) => void;
}

export function createMetadataHandlers<T = any>(metadataKey: symbol): MetadataHandlers<T> {
    function ensureMetadata(target): T {
        target[metadataKey] = target[metadataKey] || {};

        return target[metadataKey];
    }

    function setMetadata(target: any, key: keyof T, value: any) {
        ensureMetadata(target);

        target[metadataKey][key] = value;
    }

    function getMetadata(target): T {
        return target[metadataKey];
    }

    function hasMetadata(target): boolean {
        return target && target instanceof Object && metadataKey in target;
    }

    function pushMetadata(target: any, key: keyof T, value: any) {
        const metadata = ensureMetadata(target);

        if (!metadata[key]) {
            setMetadata(target, key, []);
        }

        (metadata[key] as any).push(value);
    }

    return {
        ensureMetadata,
        setMetadata,
        getMetadata,
        hasMetadata,
        pushMetadata,
    };
}