import metadataHandlers from "../metadataHandlers";
import { bootstrapSymbol } from "../constants";
import { IConstructor } from "@injex/stdlib";

export function bootstrap() {
    return function (targetConstructor: IConstructor) {
        metadataHandlers.setMetadata(targetConstructor.prototype, "item", targetConstructor);
        metadataHandlers.setMetadata(targetConstructor.prototype, "name", bootstrapSymbol);
        metadataHandlers.setMetadata(targetConstructor.prototype, "bootstrap", true);
        metadataHandlers.setMetadata(targetConstructor.prototype, "singleton", true);
    }
}