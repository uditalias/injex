import metadataHandlers from "../metadataHandlers";

export function injectAlias(alias: string, keyBy?: string) {
    return function (targetPrototype, dependency: string) {
        metadataHandlers.pushMetadata(targetPrototype.constructor, "aliasDependencies", {
            label: dependency,
            alias,
            keyBy
        });
    }
}