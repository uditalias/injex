import metadataHandlers from "../metadataHandlers";

export function singleton() {
    return function (targetConstructor) {
        metadataHandlers.setMetadata(targetConstructor, "singleton", true);
    }
}