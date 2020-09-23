import metadataHandlers from "../metadataHandlers";
import { IConstructor } from "@injex/stdlib";

export function alias(...names: string[]) {
    return function (targetConstructor: IConstructor) {
        for (let i = 0, len = names.length; i < len; i++) {
            metadataHandlers.pushMetadata(targetConstructor, "aliases", names[i]);
        }
    }
}