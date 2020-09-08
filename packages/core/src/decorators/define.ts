import { toCamelCase } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

function getDependencyName(item: any, name?: string): string {
    return name || toCamelCase(item.name);
}

export function define(name?: string) {
    return function (targetConstructor) {
        metadataHandlers.setMetadata(targetConstructor, "item", targetConstructor);
        metadataHandlers.setMetadata(targetConstructor, "name", getDependencyName(targetConstructor, name));
    }
}