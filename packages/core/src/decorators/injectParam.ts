import metadataHandlers from "../metadataHandlers";

const ARGS_REGEXP = /\(\s*([^)]+?)\s*\)/;

export function injectParam(dependencyNameOrType?: any) {
    return function (targetPrototype: object, methodName: string, index: number) {
        const args = ARGS_REGEXP.exec(targetPrototype[methodName].toString());
        if (args[1]) {
            const params = args[1].replace(/ /g, '').split(',');
            const dependency = params[index];

            metadataHandlers.pushMetadata(targetPrototype, "paramDependencies", {
                methodName,
                index,
                label: dependency,
                value: dependencyNameOrType || dependency
            });
        }
    }
}