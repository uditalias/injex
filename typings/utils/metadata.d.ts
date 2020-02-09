import { IDefinitionMetadata } from "../interfaces";
export declare type MetadataHandlers<T> = {
    ensureMetadata: (target: any) => T;
    setMetadata: (target: any, key: keyof T, value: any) => void;
    getMetadata: (target: any) => T;
    hasMetadata: (target: any) => boolean;
    pushMetadata: (target: any, key: keyof T, value: any) => void;
};
export declare function createMetadataHandlers<T = any>(metadataKey: symbol): MetadataHandlers<T>;
declare const _default: MetadataHandlers<IDefinitionMetadata>;
export default _default;
