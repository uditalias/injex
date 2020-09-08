import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

export function controller() {
	return function (targetConstructor: IConstructor) {
		metadataHandlers.ensureMetadata(targetConstructor);
	}
}