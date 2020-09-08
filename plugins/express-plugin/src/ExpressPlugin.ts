import { Application } from "express";
import * as express from "express";
import { IInjexPlugin, Injex, IModule } from "@injex/core";
import metadataHandlers from "./metadataHandlers";
import { IRoute, IExpressPluginConfig } from "./interfaces";

const expressAppSymbol = Symbol("expressApp");

// tslint:disable-next-line
function noop(...args: any[]) { }

export class InjexExpressPlugin implements IInjexPlugin {

    private config: IExpressPluginConfig;
    private app: Application;
    private container: Injex<any>;

    constructor(config?: IExpressPluginConfig) {
        this.config = this.createConfig(config);
        this.handleModule = this.handleModule.bind(this);
    }

    createConfig(config?: Partial<IExpressPluginConfig>): IExpressPluginConfig {
        return {
            app: null,
            createAppCallback: noop,
            ...config
        };
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
        this.container.addObject(this.app, expressAppSymbol);

        this.container.hooks.afterModuleCreation.tap(this.handleModule, null, this);
    }

    private handleModule(module: IModule) {

        // check if this is a @controller module
        if (metadataHandlers.hasMetadata(module.metadata.item)) {

            // get the @controller routes
            const { routes } = metadataHandlers.getMetadata(module.metadata.item);

            // convert controller handlers to express route handlers
            for (const route of routes) {
                module.metadata.singleton
                    ? this.createSingletonRouteHandler(route, module.module)
                    : this.createFactoryRouteHandler(route, module.module);
            }
        }
    }

    private createSingletonRouteHandler(route: IRoute, controller: any) {
        const self = this;
        this.app[route.method](route.path, function injexExpressPluginRouteHandler(req: express.Request, res: express.Response) {
            self.handleRoute(controller, route.handler, req, res);
        });
    }

    private createFactoryRouteHandler(route: IRoute, controllerFactory: () => any) {
        const self = this;
        this.app[route.method](route.path, async function injexExpressPluginRouteHandler(req: express.Request, res: express.Response) {
            const controller = await controllerFactory();
            self.handleRoute(controller, route.handler, req, res);
        });
    }

    private handleRoute(controller: any, handler: string, req: express.Request, res: express.Response) {
        controller[handler](req, res);
    }
}