import { setMetadata } from "../utils/metadata"

export function init() {
	return function (targetPrototype, methodName: string) {
		setMetadata(targetPrototype.constructor, "initMethod", methodName);
	}
}