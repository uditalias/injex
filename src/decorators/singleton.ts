import metadataHandlers from "../utils/metadata";

export function singleton() {
	return function (targetConstructor) {
		metadataHandlers.setMetadata(targetConstructor, "singleton", true);
	}
}