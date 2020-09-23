import { createRouteMetadata } from "../metadataHandlers";

export function post(path: string) {
	return function (targetPrototype, methodName: string, propertyDescriptor: PropertyDescriptor) {
		createRouteMetadata(
			targetPrototype.constructor,
			path,
			"post",
			methodName
		);
	}
}