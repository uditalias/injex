import { setMetadata } from "../utils/metadata"
import { bootstrapSymbol } from "../constants";

export function bootstrap() {
	return function (target) {
		setMetadata(target.prototype, "name", bootstrapSymbol);
		setMetadata(target.prototype, "bootstrap", true);
		setMetadata(target.prototype, "singleton", true);
	}
}