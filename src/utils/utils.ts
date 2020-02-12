import * as glob from "glob";
import * as fs from "fs";

export function toCamelCase(str: string): string {
	return str[0].toLowerCase() + str.slice(1);
}

export function getAllFilesInDir(dir: string, pattern?: string): string[] {
	return glob.sync(`${dir}${pattern}`);
}

export function isFunction(predicate: any): boolean {
	return typeof predicate === "function";
}

export function getPluginName(plugin): string {
	return (plugin && plugin.constructor && plugin.constructor.name);
}

export function isDirExists(dir: string): boolean {
	return fs.existsSync(dir);
}