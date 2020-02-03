// tslint:disable max-classes-per-file

export class ModuleDependencyNotFoundError extends Error {
	constructor(moduleName: string, dependencyName: string) {
		super(
			`Dependency '${dependencyName}' was not found for module '${moduleName}'.`
		);
	}
}

export class InitializeMuduleError extends Error {
	constructor(moduleName: string) {
		super(
			`Failed to initialize module '${moduleName}'.`
		);
	}
}

export class DuplicateDefinitionError extends Error {
	constructor(moduleName: string) {
		super(
			`Module '${moduleName}' already defined.`
		);
	}
}