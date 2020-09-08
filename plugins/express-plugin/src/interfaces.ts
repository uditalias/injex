import { Application } from "express";

export interface IRoute {
    path: string;
    method: string;
    handler: string;
}

export interface IMetadata {
    routes: IRoute[];
}

export interface IExpressPluginConfig {
    app?: Application;
    createAppCallback?: CreateAppCallback;
}

export type CreateAppCallback = (app: Application) => Promise<void> | void;