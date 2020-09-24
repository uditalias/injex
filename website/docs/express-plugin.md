---
id: express-plugin
title: Express Plugin
sidebar_label: Express Plugin
slug: /plugins/express
---

<img src="https://img.shields.io/npm/v/@injex/express-plugin" />

The Express Plugin provides a set of tools to work with the [Express Framework](https://expressjs.com/) to create Express applications in a better and organized way.

The plugin expose decorators for creating controllers, route handlers and middlewares that wraps the Express API.

This plugin should be used with Injex's Node runtime.

## Installation

You can install the Env Plugin via NPM or Yarn.

```bash npm2yarn
npm install --save @injex/express-plugin
```

You should also make sure `express` is installed in your project.

## Initialization

Creating the plugin and passing it to the runtime container config object

```ts
import { Injex } from "@injex/node";
import { ExpressPlugin } from "@injex/express-plugin";

Injex.create({
    rootDirs: [__dirname],
    plugins: [
        new ExpressPlugin({
            // plugin configurations
        })
    ]
});
```

## Configurations

### `name`

The express application instance container name in the runtime container for later injection.

- Type: `string`
- Default: `expressApp`
- Required: `false`

### `app`

If you already have an express instance in your application, you can pass it to the `app` config option so the plugin will use it.

For example:

```ts
import { ExpressPlugin } from "@injex/express-plugin";
import * as express from "express";

const myApp = express();

const plugin = new ExpressPlugin({
    app: myApp
})
```

- Type: `ExpressApplication instance`
- Default: null
- Required: `false`

### `createAppCallback`

If you don't provide the `app` config option, the Express Plugin will create one for you. You can pass in the `createAppCallback` if you want to hook up the application instance in order to customize it using middlewares or listening to a network port.

For example:

```ts
import { Injex } from "@injex/node";
import { ExpressPlugin } from "@injex/express-plugin";
import * as bodyParser from "body-parser";

Injex.create({
    ...
    plugins: [
        ...
        new ExpressPlugin({
            createAppCallback: (app) => {
                app.use(bodyParser());
                app.listen(8080);
            }
        })
    ]
})
```

- Type: `Function`
- Default: `function(app: Application) { }`
- Required: `false`

## Usage

As mentioned above, the Express plugin exposes decorators to handle routes and middlewares inside a controller. A controller is a collection of route handlers related to a specific domain in your application. An interesting part about controllers is the fact that they responds to the `@singleton()` decorator, so you can create a singleton controller or a factory based controller that will be created for each request.

### `@controller()`

Defines a class and mark it as a controller. If the `@singleton()` decorator is also used, only one controller will be created for all requests, otherwise, a controller instance will be created for each request.

```ts {2}
@define()
@controller()
export class TodosController {

}
```

### `@get()`, `@post()`, `@patch()`, `@put()`, `@del()`

HTTP method handler decorators to define route handlers inside a controller.

```ts {5}
@define()
@controller()
export class TodosController {
   
   @get("/todos/:id")
   public getTodo(req, res) {
       res.send({
           id: req.param.id,
           text: "Learn how to use the Injex framework",
           status: "in_progress"
       });
   }
}
```

### `@middleware()`

Define a middleware or a list of chainable middlewares on a controller route handler. A middleware is a class that implements the `IMiddleware` interface.

Note that you can pass an array of middlewares (`@middleware([ ... ])`), in that case, the middlewares will be called from left to right. If a middleware failed with an error, the route handler function will not be triggered.

```ts {23}
@define()
@singleton()
export class AuthMiddleware implements IMiddleware {

    // IMiddleware handler, receives express's request, response
    // and the next function
    public handle(req, res, next) {
        const token = req.query.token;
        if (token === "123456") {
            next();
        } else {
            res.send("unauthorize");
            next(new Error("unauthorize"));
        }
    }
}

@define()
@controller()
export class TodosController {
   
   @get("/todos/:id")
   @middleware(AuthMiddleware)
   public getTodo(req, res) {
       res.send({
           id: req.param.id,
           text: "Learn how to use the Injex framework",
           status: "in_progress"
       });
   }
}
```

## A full example

```ts
import { define, singleton } from "@injex/core";
import { controller, get, del, post, patch } from "@injex/express-plugin";

@define()
@singleton()
@controller()
export class TodosController {

    @inject() private todosManager;

    @get("/todos/")
    public async getAllTodos(req, res) {
        const todos = await this.todosManager.getAll();
        res.send(todos);
    }

    @get("/todos/:id")
    @middleware(AuthMiddleware)
    public async getTodo(req, res) {
        const todo = await this.todosManager.getOne(req.params.id);
        res.send(todo);
    }

    @del("/todos/:id")
    public async deleteTodo(req, res) {
        await this.todosManager.del(req.params.id);
        res.status(204).end();
    }

    @post("/todos/")
    public async createTodo(req, res) {
        const todo = await this.todosManager.create(req.params.id, req.body);
        res.status(201).send(todo);
    }

    @patch("/todos/:id")
    public async updateTodo(req, res) {
        const todo = await this.todosManager.update(req.params.id, req.body);
        res.send(todo);
    }

    @patch("/todos/:id/toggle")
    public async toggleTodo(req, res) {
        await this.todosManager.toggle(req.params.id);
        res.status(201).end();
    }
}
```

If you want a quick demo to play with, check out the [express example](/docs/examples#express-plugin-example) in the examples section.