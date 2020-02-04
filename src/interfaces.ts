import { LogLevel } from "./utils/logger";

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
	name?: string;
	singleton?: boolean;
	dependencies?: IDependency[];
	initMethod?: string;
	bootstrap?: boolean;
}

export interface IBootstrap {
	run(): Promise<void> | void;
}