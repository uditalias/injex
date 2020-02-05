import { setMetadata } from "../utils/metadata"
import { bootstrapSymbol } from "../constants";

export function bootstrap() {
	return function (targetConstructor) {
		setMetadata(targetConstructor, "name", bootstrapSymbol);
		setMetadata(targetConstructor, "bootstrap", true);
		setMetadata(targetConstructor, "singleton", true);
	}
}