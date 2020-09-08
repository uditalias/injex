import { createMetadataHandlers } from "@injex/stdlib";
import { IDefinitionMetadata } from "./interfaces";

const metadataSymbol = Symbol("metadata");

export default createMetadataHandlers<IDefinitionMetadata>(metadataSymbol);