import metadataHandlers from "../metadataHandlers";

export function injectAlias(alias: string, keyBy?: string) {
    return function (targetPrototype: object, dependency: string) {
        metadataHandlers.pushMetadata(targetPrototype, "aliasDependencies", {
            label: dependency,
            alias,
            keyBy
        });
    }
}