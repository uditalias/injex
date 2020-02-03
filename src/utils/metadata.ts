import { IDefinitionMetadata } from "../interfaces";

const metadataSymbol = Symbol("metadata");

export function ensureMetadata(target): IDefinitionMetadata {
	target[metadataSymbol] = target[metadataSymbol] || {};

	return target[metadataSymbol];
}

export function setMetadata(target: any, key: keyof IDefinitionMetadata, value: any) {
	ensureMetadata(target)

	target[metadataSymbol][key] = value;
}

export function getMetadata(target): IDefinitionMetadata {
	return target[metadataSymbol];
}

export function hasMetadata(target): boolean {
	return target && target instanceof Object && Reflect.has(target, metadataSymbol);
}

export function pushMetadata(target: any, key: keyof IDefinitionMetadata, value: any) {
	const metadata = ensureMetadata(target);

	if (!metadata[key]) {
		setMetadata(target, key, []);
	}

	metadata[key].push(value);
}