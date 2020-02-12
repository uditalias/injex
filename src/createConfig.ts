import { IContainerConfig } from "./interfaces";
import { LogLevel } from ".";
import * as path from "path";

export default function createConfig(config: Partial<IContainerConfig> = {}): IContainerConfig {
	return {
		logLevel: LogLevel.Error,
		rootDirs: [
			path.resolve(process.cwd(), "./src")
		],
		logNamespace: "Injex",
		globPattern: "/**/*.js",
		plugins: [],
		...config
	};
}