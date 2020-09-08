import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

export function lazy() {
    return function (targetConstructor: IConstructor) {
        metadataHandlers.setMetadata(targetConstructor, "lazy", true);
        metadataHandlers.setMetadata(targetConstructor, "singleton", true);
    }
}