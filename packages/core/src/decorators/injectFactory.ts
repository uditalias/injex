import metadataHandlers from "../metadataHandlers";

export function injectFactory(dependencyNameOrType?: any) {
    return function (targetPrototype: object, dependency: string) {
        metadataHandlers.pushMetadata(targetPrototype, "factoryDependencies", {
            label: dependency,
            value: dependencyNameOrType || dependency
        });
    }
}