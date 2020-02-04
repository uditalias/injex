import { IContainerConfig } from "./interfaces";
export default class InjexContainer {
    private config;
    private logger;
    private moduleRegistry;
    private modules;
    private bootstrapModuleName;
    static create(config: IContainerConfig): InjexContainer;
    private constructor();
    bootstrap(): Promise<InjexContainer>;
    private loadProjectFiles;
    private throwIfAlreadyDefined;
    private throwIfModuleExists;
    private createModules;
    private initializeModules;
    private invokeModuleInitMethod;
    private createInstance;
    private injectModuleDependencies;
    private register;
    /**
     * Manually add object to the container
     *
     * @param obj - Object to add
     * @param name - Name of the object
     */
    addObject(obj: any, name: string): InjexContainer;
    /**
     * Remove object from container
     *
     * @param name - Name of the object
     */
    removeObject(name: string): InjexContainer;
    get<T = any>(itemNameOrType: any): T;
}
