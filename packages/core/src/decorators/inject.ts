import metadataHandlers from "../metadataHandlers";

export function inject(dependencyNameOrType?: any) {
    return function (targetPrototype: object, dependency: string) {
        metadataHandlers.pushMetadata(targetPrototype, "dependencies", {
            label: dependency,
            value: dependencyNameOrType || dependency
        });
    }
}