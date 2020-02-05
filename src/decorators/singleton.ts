import { setMetadata } from "../utils/metadata";

export function singleton() {
	return function (targetConstructor) {
		setMetadata(targetConstructor, "singleton", true);
	}
}