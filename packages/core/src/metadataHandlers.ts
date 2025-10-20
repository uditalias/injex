import { createMetadataHandlers } from "@injex/stdlib";
import { IDefinitionMetadata } from "./interfaces";

export const metadataSymbol = Symbol("injex:metadata");

export default createMetadataHandlers<IDefinitionMetadata>(metadataSymbol);