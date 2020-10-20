import { Application, NextFunction } from "express";
import * as express from "express";
import { IInjexPlugin, Injex, IModule } from "@injex/core";
import metadataHandlers from "./metadataHandlers";
import { IRouteConfig, IExpressPluginConfig, IMiddlewareConfig, IMiddleware, ExpressRequestHandler } from "./interfaces";
import createConfig from "./createConfig";

export class ExpressPlugin implements IInjexPlugin {

    private config: IExpressPluginConfig;
    private app: Application;
    private container: Injex<any>;
    private controllerModules: IModule[];

    constructor(config?: IExpressPluginConfig) {
        this.config = createConfig(config);
        this.controllerModules = [];
        this.handleModule = this.handleModule.bind(this);
    }

    public async apply(container: Injex<any>): Promise<void> {

        const { app, createAppCallback } = this.config;

        this.container = container;

        if (app) {
            this.app = app;
        } else {
            this.app = express();

            if (typeof createAppCallback === "function") {
                await createAppCallback(this.app);
            }
        }

        // save the express app instance for later use
        this.container.addObject(this.app, this.config.name);

        this.container.hooks.afterModuleCreation.tap(this.handleModule, null, this);
        this.container.hooks.afterCreateModules.tap(this.initializeControllers, null, this);
    }

    private initializeControllers() {
        for (const controllerModule of this.controllerModules) {
            const { routes = [], middlewares = [] } = metadataHandlers.getMetadata(controllerModule.metadata.item);

            // convert controller handlers to express route handlers
            for (const route of routes) {
                const handlerMiddlewares = this.getMiddlewareModulesForRoute(route, middlewares);
                controllerModule.metadata.singleton
                    ? this.createSingletonRouteHandler(route, controllerModule.module, handlerMiddlewares)
                    : this.createFactoryRouteHandler(route, controllerModule.module, handlerMiddlewares);
            }
        }

        // remove all controller modules references
        this.controllerModules.length = 0;
    }

    private handleModule(module: IModule) {

        // check if this is a @controller module
        if (metadataHandlers.hasMetadata(module.metadata.item)) {
            const { controller } = metadataHandlers.getMetadata(module.metadata.item);

            // module must be decorated with @controller()
            if (!controller) {
                return;
            }

            this.controllerModules.push(module);
        }
    }

    private getMiddlewareModulesForRoute(route: IRouteConfig, middlewares: IMiddlewareConfig[]): IModule[] {
        const routeMiddlewares: IModule[] = [];

        let config: IMiddlewareConfig;
        for (let i = 0, len = middlewares.length; i < len; i++) {
            config = middlewares[i];
            if (config.handler === route.handler) {
                // @ts-ignore
                const middlewareModule = this.container.getModuleDefinition(config.middleware);
                if (middlewareModule) {
                    routeMiddlewares.push(middlewareModule);
                }
            }
        }

        return routeMiddlewares;
    }

    private createSingletonRouteHandler(route: IRouteConfig, controller: any, middlewares: IModule[] = []) {
        const self = this;

        const args: any[] = [route.path];

        if (middlewares.length) {
            args.push(this.createRouteMiddleware(middlewares));
        }

        args.push(function injexExpressPluginRouteHandler(req: express.Request, res: express.Response) {
            self.handleRoute(controller, route.handler, req, res);
        });

        this.app[route.method](...args);
    }

    private createFactoryRouteHandler(route: IRouteConfig, controllerFactory: () => any, middlewares: IModule[] = []) {
        const self = this;

        const args: any[] = [route.path];

        if (middlewares.length) {
            args.push(this.createRouteMiddleware(middlewares));
        }

        args.push(async function injexExpressPluginRouteHandler(req: express.Request, res: express.Response) {
            const controller = await controllerFactory();
            self.handleRoute(controller, route.handler, req, res);
        });

        this.app[route.method](...args);
    }

    private handleRoute(controller: any, handler: string, req: express.Request, res: express.Response) {
        controller[handler](req, res);
    }

    private createRouteMiddleware(middlewares: IModule[]): ExpressRequestHandler {
        const self = this;

        return async function (req: Express.Request, res: Express.Response, next: NextFunction) {
            const chain = [];
            for (let i = 0, len = middlewares.length; i < len; i++) {
                chain.push(
                    middlewares[i].metadata.singleton
                        ? middlewares[i].module
                        : await middlewares[i].module()
                );
            }

            self.executeMiddlewareChain(chain, req, res, next);
        }
    }

    private executeMiddlewareChain(middlewares: IMiddleware[], req: Express.Request, res: Express.Response, next: NextFunction) {
        const self = this;
        const middleware = middlewares.shift();

        if (middleware) {
            // call each middleware `handle` fn. the middleware next fn
            // will call the next middleware `handle` fn recursively until
            // there are'nt middlwares in the middleware chain.
            middleware.handle(req, res, function (error) {
                if (error) {
                    next(error);
                } else {
                    self.executeMiddlewareChain(middlewares, req, res, next);
                }
            });
        } else {
            // call the original express next function at the end of the chain
            // to trigger the route handler.
            next();
        }
    }
}