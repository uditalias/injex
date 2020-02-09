import { IDefinitionMetadata } from "../interfaces";
export declare type MetadataHandlers = {
    ensureMetadata: (target: any) => IDefinitionMetadata;
    setMetadata: (target: any, key: keyof IDefinitionMetadata, value: any) => void;
    getMetadata: (target: any) => IDefinitionMetadata;
    hasMetadata: (target: any) => boolean;
    pushMetadata: (target: any, key: keyof IDefinitionMetadata, value: any) => void;
};
export declare function createMetadataHandlers(metadataKey: symbol): MetadataHandlers;
declare const _default: MetadataHandlers;
export default _default;
