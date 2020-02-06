import { IContainerConfig } from "./interfaces";
import { LogLevel } from ".";

export default function createConfig(config: Partial<IContainerConfig>): IContainerConfig {
	return {
		logLevel: LogLevel.Error,
		rootDirs: [
			process.cwd()
		],
		logNamespace: "Injex",
		globPattern: "/**/*.js",
		plugins: [],
		...config
	};
}