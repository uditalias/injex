import { setMetadata } from "../utils/metadata";

export function singleton() {
	return function (target) {
		setMetadata(target.prototype, "singleton", true);
	}
}