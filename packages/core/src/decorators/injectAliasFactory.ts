import metadataHandlers from "../metadataHandlers";

export function injectAliasFactory(alias: string, keyBy: string) {
    return function (targetPrototype, dependency: string) {
        metadataHandlers.pushMetadata(targetPrototype.constructor, "aliasFactories", {
            label: dependency,
            alias,
            keyBy
        });
    }
}