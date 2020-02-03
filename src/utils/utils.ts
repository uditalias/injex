import * as glob from "glob";

export function toCamelCase(str: string): string {
	return str[0].toLowerCase() + str.slice(1);
}

export function getAllFilesInDir(dir: string, pattern?: string): string[] {
	return glob.sync(`${dir}${pattern}`);
}

export function isFunction(predicate: any): boolean {
	return typeof predicate === "function";
}