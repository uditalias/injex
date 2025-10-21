/**
 * Field decorator registry for TC39 decorators
 *
 * Since field decorators don't have a target to attach markers to,
 * we store field metadata in the decorator context.metadata object,
 * which is then accessible from class decorators.
 */

/**
 * Symbol used to store pending field metadata in context.metadata
 */
const PENDING_FIELD_METADATA = Symbol('injex:pending-field-metadata');

export type FieldMetadataType = 'dependency' | 'factoryDependency' | 'aliasDependency';

export interface FieldMetadata {
    type: FieldMetadataType;
    data: any;
}

/**
 * Registers field metadata in the decorator context.metadata
 * This is called by field decorators (@inject, @injectFactory, @injectAlias)
 *
 * @param metadata - The context.metadata object from the decorator
 * @param type - The type of field metadata
 * @param data - The metadata to store
 */
export function registerFieldMetadata(metadata: any, type: FieldMetadataType, data: any): void {
    if (!metadata[PENDING_FIELD_METADATA]) {
        metadata[PENDING_FIELD_METADATA] = [];
    }

    metadata[PENDING_FIELD_METADATA].push({ type, data });
}

/**
 * Retrieves all pending field metadata from a class decorator context
 * This is called by class decorators during metadata collection
 *
 * @param metadata - The context.metadata object from the class decorator
 * @returns Array of field metadata
 */
export function collectFieldMetadata(metadata: any): FieldMetadata[] {
    return metadata[PENDING_FIELD_METADATA] || [];
}
