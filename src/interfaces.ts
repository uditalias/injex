import { LogLevel } from "./utils/logger";
import { ModuleName } from "./utils/metadata";

export interface IModule {
	metadata: IDefinitionMetadata;
	module: any;
}

export interface IDependency {
	label: any;
	value: any;
}

export interface IContainerConfig {
	rootDirs?: string[];
	logLevel?: LogLevel;
	logNamespace?: string;
	globPattern?: string;
}

export interface IDefinitionMetadata {
	item: any;
	name?: ModuleName;
	singleton?: boolean;
	dependencies?: IDependency[];
	initMethod?: string;
	bootstrap?: boolean;
}

export interface IBootstrap {
	run(): Promise<void> | void;
}