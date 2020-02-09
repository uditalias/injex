"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createMetadataHandlers(metadataKey) {
    function ensureMetadata(target) {
        target[metadataKey] = target[metadataKey] || {};
        return target[metadataKey];
    }
    function setMetadata(target, key, value) {
        ensureMetadata(target);
        target[metadataKey][key] = value;
    }
    function getMetadata(target) {
        return target[metadataKey];
    }
    function hasMetadata(target) {
        return target && target instanceof Object && Reflect.has(target, metadataKey);
    }
    function pushMetadata(target, key, value) {
        const metadata = ensureMetadata(target);
        if (!metadata[key]) {
            setMetadata(target, key, []);
        }
        metadata[key].push(value);
    }
    return {
        ensureMetadata,
        setMetadata,
        getMetadata,
        hasMetadata,
        pushMetadata,
    };
}
exports.createMetadataHandlers = createMetadataHandlers;
const metadataSymbol = Symbol("metadata");
exports.default = createMetadataHandlers(metadataSymbol);
//# sourceMappingURL=metadata.js.map