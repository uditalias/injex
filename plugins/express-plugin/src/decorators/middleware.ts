import { IMiddleware } from "../interfaces";
import metadataHandlers from "../metadataHandlers";

export type MiddlewareNameOrType = IMiddleware | string;

export function middleware(middlewareNameOrType: MiddlewareNameOrType | MiddlewareNameOrType[]) {
    return function (targetPrototype, methodName: string, propertyDescriptor: PropertyDescriptor) {

        function addMiddleware(mw) {
            metadataHandlers.pushMetadata(targetPrototype.constructor, "middlewares", {
                middleware: mw,
                handler: methodName
            });
        }

        if (middlewareNameOrType instanceof Array) {
            middlewareNameOrType.forEach(addMiddleware);
        } else {
            addMiddleware(middlewareNameOrType);
        }
    }
}