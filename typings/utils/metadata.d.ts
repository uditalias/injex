import { IDefinitionMetadata } from "../interfaces";
export declare function ensureMetadata(target: any): IDefinitionMetadata;
export declare function setMetadata(target: any, key: keyof IDefinitionMetadata, value: any): void;
export declare function getMetadata(target: any): IDefinitionMetadata;
export declare function hasMetadata(target: any): boolean;
export declare function pushMetadata(target: any, key: keyof IDefinitionMetadata, value: any): void;
