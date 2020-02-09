import { toCamelCase } from "../utils/utils";
import metadataHandlers from "../utils/metadata";

function getDependencyName(item: any, name?: string): string {
	return name || toCamelCase(Reflect.get(item, "name"));
}

export function define(name?: string) {
	return function (targetConstructor) {
		metadataHandlers.setMetadata(targetConstructor, "item", targetConstructor);
		metadataHandlers.setMetadata(targetConstructor, "name", getDependencyName(targetConstructor, name));
	}
}