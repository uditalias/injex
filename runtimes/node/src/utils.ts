import * as glob from "glob";
import * as fs from "fs";

export function getAllFilesInDir(dir: string, pattern?: string): string[] {
    return glob.sync(`${dir}${pattern}`);
}

export function isDirExists(dir: string): boolean {
    return fs.existsSync(dir);
}