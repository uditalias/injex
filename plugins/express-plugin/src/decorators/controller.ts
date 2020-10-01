import { IConstructor } from "@injex/stdlib";
import metadataHandlers from "../metadataHandlers";

export function controller() {
	return function (targetConstructor: IConstructor) {
		metadataHandlers.setMetadata(targetConstructor, "controller", true);
	}
}