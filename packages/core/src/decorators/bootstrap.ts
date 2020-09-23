import metadataHandlers from "../metadataHandlers";
import { bootstrapSymbol } from "../constants";

export function bootstrap() {
    return function (targetConstructor) {
        metadataHandlers.setMetadata(targetConstructor, "name", bootstrapSymbol);
        metadataHandlers.setMetadata(targetConstructor, "bootstrap", true);
        metadataHandlers.setMetadata(targetConstructor, "singleton", true);
    }
}