/**
 * Marker-based metadata collection for TC39 decorators
 *
 * This system solves the inheritance problem with TC39 decorators:
 * - Field/method decorators store "markers" on the prototype
 * - Class decorators collect all markers and store them in the metadata system
 * - This happens at class definition time, not instance creation time
 * - Works with inheritance because each class definition triggers collection
 */

import metadataHandlers from "../metadataHandlers";
import { collectFieldMetadata } from "./fieldRegistry";

/**
 * Symbol used to mark decorated class members with pending metadata
 */
const METADATA_MARKER = Symbol('injex:pending-metadata');

/**
 * Types of metadata markers
 */
type MarkerType =
    | 'dependency'
    | 'factoryDependency'
    | 'aliasDependency'
    | 'initMethod'
    | 'readyMethod'
    | 'paramDependency';

interface MetadataMarker {
    type: MarkerType;
    data: any;
}

/**
 * Adds a metadata marker to a class member (method or field)
 *
 * @param target - The method/field being decorated
 * @param type - The type of metadata
 * @param data - The metadata to store
 */
export function addMarker(target: any, type: MarkerType, data: any): void {
    if (!target) return;

    // Initialize markers array if needed
    if (!target[METADATA_MARKER]) {
        target[METADATA_MARKER] = [];
    }

    target[METADATA_MARKER].push({ type, data });
}

/**
 * Collects all metadata markers from a class and stores them in the metadata system
 * This should be called by class decorators (@define, @singleton)
 *
 * Collects both method markers and field metadata from context.metadata.
 *
 * @param targetConstructor - The class constructor
 * @param contextMetadata - The context.metadata from the class decorator
 */
export function collectMarkers(targetConstructor: any, contextMetadata?: any): void {
    const prototype = targetConstructor.prototype;

    // Collect markers from all own properties on the prototype (methods)
    const propertyNames = Object.getOwnPropertyNames(prototype);

    for (const propertyName of propertyNames) {
        if (propertyName === 'constructor') continue;

        const member = prototype[propertyName];

        // Check if this member has markers (methods will have them)
        if (member && member[METADATA_MARKER]) {
            const markers: MetadataMarker[] = member[METADATA_MARKER];

            for (const marker of markers) {
                switch (marker.type) {
                    case 'dependency':
                        metadataHandlers.pushMetadata(targetConstructor, 'dependencies', marker.data);
                        break;
                    case 'factoryDependency':
                        metadataHandlers.pushMetadata(targetConstructor, 'factoryDependencies', marker.data);
                        break;
                    case 'aliasDependency':
                        metadataHandlers.pushMetadata(targetConstructor, 'aliasDependencies', marker.data);
                        break;
                    case 'initMethod':
                        metadataHandlers.setMetadata(targetConstructor, 'initMethod', marker.data);
                        break;
                    case 'readyMethod':
                        metadataHandlers.setMetadata(targetConstructor, 'readyMethod', marker.data);
                        break;
                    case 'paramDependency':
                        metadataHandlers.pushMetadata(targetConstructor, 'paramDependencies', marker.data);
                        break;
                }
            }
        }
    }

    // Collect field metadata from context.metadata if provided
    if (contextMetadata) {
        const fieldMetadata = collectFieldMetadata(contextMetadata);

        for (const field of fieldMetadata) {
            switch (field.type) {
                case 'dependency':
                    metadataHandlers.pushMetadata(targetConstructor, 'dependencies', field.data);
                    break;
                case 'factoryDependency':
                    metadataHandlers.pushMetadata(targetConstructor, 'factoryDependencies', field.data);
                    break;
                case 'aliasDependency':
                    metadataHandlers.pushMetadata(targetConstructor, 'aliasDependencies', field.data);
                    break;
            }
        }
    }
}
