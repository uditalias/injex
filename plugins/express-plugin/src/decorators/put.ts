import { createRouteMetadata } from "../metadataHandlers";

export function put(path: string) {
    return function (targetPrototype, methodName: string, propertyDescriptor: PropertyDescriptor) {
        createRouteMetadata(
            targetPrototype.constructor,
            path,
            "put",
            methodName
        );
    }
}