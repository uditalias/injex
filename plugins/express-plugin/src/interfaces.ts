import { IConstructor } from "@injex/stdlib";
import { Application, NextFunction } from "express";

export interface IRouteConfig {
    path: string;
    method: string;
    handler: string;
}

export interface IMiddlewareConfig {
    middleware: IMiddleware | string;
    handler: string;
}

export interface IMiddleware extends IConstructor {
    handle(req: Express.Request, res: Express.Response, next: NextFunction): void;
}

export interface IMetadata {
    controller: boolean;
    routes: IRouteConfig[];
    middlewares: IMiddlewareConfig[];
}

export interface IExpressPluginConfig {
    name?: string;
    app?: Application;
    createAppCallback?: CreateAppCallback;
}

export type CreateAppCallback = (app: Application) => Promise<void> | void;

export type ExpressRequestHandler = (req: Express.Request, res: Express.Response, next: NextFunction) => void;