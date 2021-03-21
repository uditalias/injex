import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

export function singleton() {
    return function (targetConstructor: IConstructor) {
        metadataHandlers.setMetadata(targetConstructor.prototype, "singleton", true);
    }
}