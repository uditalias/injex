import metadataHandlers from "../metadataHandlers"

export function init() {
    return function (targetPrototype, methodName: string) {
        metadataHandlers.setMetadata(targetPrototype, "initMethod", methodName);
    }
}