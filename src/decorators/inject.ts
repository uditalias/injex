import { pushMetadata } from "../utils/metadata";

export function inject(dependencyNameOrType?: any) {
	return function (target, dependency: string) {
		pushMetadata(target, "dependencies", {
			label: dependency,
			value: dependencyNameOrType || dependency
		});
	}
}