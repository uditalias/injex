import { IContainerConfig, IInjextHooks } from "./interfaces";
import { Logger } from "./utils/logger";
export default class InjexContainer {
    private config;
    logger: Logger;
    private moduleRegistry;
    private modules;
    hooks: IInjextHooks;
    static create(config: IContainerConfig): InjexContainer;
    private constructor();
    bootstrap(): Promise<InjexContainer>;
    private initPlugins;
    private createHooks;
    private loadProjectFiles;
    private throwIfAlreadyDefined;
    private throwIfModuleExists;
    private throwIfInvalidPlugin;
    private createModules;
    private createModuleFactoryMethod;
    private initializeModules;
    private invokeModuleInitMethod;
    private createInstance;
    private injectModuleDependencies;
    private register;
    /**
     * Manually add object to the container as singleton
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
