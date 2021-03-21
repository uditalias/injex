import { IConstructor, toCamelCase } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

function getDependencyName(item: any, name?: string): string {
    return name || toCamelCase(item.name);
}

export function define(name?: string) {
    return function (targetConstructor: IConstructor) {
        metadataHandlers.setMetadata(targetConstructor.prototype, "item", targetConstructor);
        metadataHandlers.setMetadata(targetConstructor.prototype, "name", getDependencyName(targetConstructor, name));
    }
}