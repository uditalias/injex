import { ModuleName } from "./utils/metadata";

// tslint:disable max-classes-per-file

export class ModuleDependencyNotFoundError extends Error {
	constructor(moduleName: ModuleName, dependencyName: ModuleName) {
		moduleName = moduleName.toString();
		dependencyName = dependencyName.toString();

		super(
			`Dependency '${dependencyName}' was not found for module '${moduleName}'.`
		);
	}
}

export class InitializeMuduleError extends Error {
	constructor(moduleName: ModuleName) {
		moduleName = moduleName.toString();

		super(
			`Failed to initialize module '${moduleName}'.`
		);
	}
}

export class DuplicateDefinitionError extends Error {
	constructor(moduleName: ModuleName) {
		moduleName = moduleName.toString();

		super(
			`Module '${moduleName}' already defined.`
		);
	}
}