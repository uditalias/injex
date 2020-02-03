import { setMetadata } from "../utils/metadata"

export function init() {
	return function (target, methodName: string) {
		setMetadata(target, "initMethod", methodName);
	}
}