import metadataHandlers from "../utils/metadata"

export function init() {
	return function (targetPrototype, methodName: string) {
		metadataHandlers.setMetadata(targetPrototype.constructor, "initMethod", methodName);
	}
}