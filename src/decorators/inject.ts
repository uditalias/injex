import { pushMetadata } from "../utils/metadata";

export function inject(dependencyNameOrType?: any) {
	return function (targetPrototype, dependency: string) {
		pushMetadata(targetPrototype.constructor, "dependencies", {
			label: dependency,
			value: dependencyNameOrType || dependency
		});
	}
}