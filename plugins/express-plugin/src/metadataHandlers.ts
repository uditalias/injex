import { IMetadata } from "./interfaces";
import { createMetadataHandlers } from "@injex/stdlib";

const expressMetadataSymbol = Symbol("expressMetadata");

const metadataHandlers = createMetadataHandlers<IMetadata>(expressMetadataSymbol);

export function createRouteMetadata(targetConstructor, path: string, method: string, handler: string) {
	metadataHandlers.pushMetadata(targetConstructor, "routes", {
		path,
		method,
		handler
	});
}

export default metadataHandlers;