export class RootDirectoryNotExistError extends Error {
    constructor(dir: string) {
        super(
            `Root directory '${dir}' doesn't exist.`
        );
    }
}