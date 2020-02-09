import { IDefinitionMetadata } from "../interfaces";

export type MetadataHandlers = {
	ensureMetadata: (target: any) => IDefinitionMetadata;
	setMetadata: (target: any, key: keyof IDefinitionMetadata, value: any) => void;
	getMetadata: (target: any) => IDefinitionMetadata;
	hasMetadata: (target: any) => boolean;
	pushMetadata: (target: any, key: keyof IDefinitionMetadata, value: any) => void;
}

export function createMetadataHandlers(metadataKey: symbol): MetadataHandlers {
	function ensureMetadata(target): IDefinitionMetadata {
		target[metadataKey] = target[metadataKey] || {};

		return target[metadataKey];
	}

	function setMetadata(target: any, key: keyof IDefinitionMetadata, value: any) {
		ensureMetadata(target)

		target[metadataKey][key] = value;
	}

	function getMetadata(target): IDefinitionMetadata {
		return target[metadataKey];
	}

	function hasMetadata(target): boolean {
		return target && target instanceof Object && Reflect.has(target, metadataKey);
	}

	function pushMetadata(target: any, key: keyof IDefinitionMetadata, value: any) {
		const metadata = ensureMetadata(target);

		if (!metadata[key]) {
			setMetadata(target, key, []);
		}

		metadata[key].push(value);
	}

	return {
		ensureMetadata,
		setMetadata,
		getMetadata,
		hasMetadata,
		pushMetadata,
	};
}

const metadataSymbol = Symbol("metadata");

export default createMetadataHandlers(metadataSymbol);