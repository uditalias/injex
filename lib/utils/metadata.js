"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadataSymbol = Symbol("metadata");
function ensureMetadata(target) {
    target[metadataSymbol] = target[metadataSymbol] || {};
    return target[metadataSymbol];
}
exports.ensureMetadata = ensureMetadata;
function setMetadata(target, key, value) {
    ensureMetadata(target);
    target[metadataSymbol][key] = value;
}
exports.setMetadata = setMetadata;
function getMetadata(target) {
    return target[metadataSymbol];
}
exports.getMetadata = getMetadata;
function hasMetadata(target) {
    return target && target instanceof Object && Reflect.has(target, metadataSymbol);
}
exports.hasMetadata = hasMetadata;
function pushMetadata(target, key, value) {
    const metadata = ensureMetadata(target);
    if (!metadata[key]) {
        setMetadata(target, key, []);
    }
    metadata[key].push(value);
}
exports.pushMetadata = pushMetadata;
//# sourceMappingURL=metadata.js.map