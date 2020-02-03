import { toCamelCase } from "../utils/utils";
import { setMetadata } from "../utils/metadata";

function getDependencyName(item: any, name?: string): string {
	return name || toCamelCase(Reflect.get(item, "name"));
}

export function define(name?: string) {
	return function (target) {
		setMetadata(target.prototype, "item", target);
		setMetadata(target.prototype, "name", getDependencyName(target, name));
	}
}