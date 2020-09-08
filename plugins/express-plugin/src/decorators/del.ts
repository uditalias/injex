import { createRouteMetadata } from "../metadataHandlers";

export function del(path: string) {
    return function (targetPrototype, methodName: string, propertyDescriptor: PropertyDescriptor) {
        createRouteMetadata(
            targetPrototype.constructor,
            path,
            "delete",
            methodName
        );
    }
}