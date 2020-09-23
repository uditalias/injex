import { createRouteMetadata } from "../metadataHandlers";

export function get(path: string) {
	return function (targetPrototype, methodName: string, propertyDescriptor: PropertyDescriptor) {
		createRouteMetadata(
			targetPrototype.constructor,
			path,
			"get",
			methodName
		);
	}
}