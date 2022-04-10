import metadataHandlers from "../metadataHandlers"

export function ready() {
    return function (targetPrototype, methodName: string) {
        metadataHandlers.setMetadata(targetPrototype, "readyMethod", methodName);
    }
}