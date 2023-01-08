export class RemoteModulesError extends Error {
    constructor() {
        super('Failed to load remote modules');
    }
}