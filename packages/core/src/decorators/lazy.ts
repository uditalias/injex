import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

export function lazy() {
    return function (targetConstructor: IConstructor) {
        metadataHandlers.setMetadata(targetConstructor.prototype, "lazy", true);
        metadataHandlers.setMetadata(targetConstructor.prototype, "singleton", true);
    }
}