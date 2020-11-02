---
id: react-plugin
title: React Plugin
sidebar_label: React Plugin
slug: /plugins/react
---

<img src="https://img.shields.io/npm/v/@injex/react-plugin?style=for-the-badge" className="markdown-badge" />

The React plugin makes it easier to inject dependencies from an Injex container into React components using react hooks.
The Plugin creates a Context provider and exposes the `useInjex()` hook, so you can use Injex container API to inject your application modules into your application components.

## Installation

You can install the React Plugin via NPM or Yarn.

```bash npm2yarn
npm install --save @injex/react-plugin
```

You should also make sure `React` and `ReactDOM` is installed on your project.

## Initialization

Creating the plugin and passing it to the runtime container config object

```ts
import { Injex } from "@injex/node";
import { ReactPlugin } from "@injex/react-plugin";

Injex.create({
    rootDirs: [__dirname],
    plugins: [
        new ReactPlugin({
            // plugin configurations
        })
    ]
});
```

## Configurations

### `render`

The render function from React. The default is the render function from `react-dom`.
This configuration is pretty rare and it used where you have more than one react version in your application.

- Type: `function`
- Default: `render` from `react-dom`
- Required: `false`

### `rootElementOrSelector`

An HTML element or string selector to use with the `RenderInjexProvider` method.

- Type: `HTMLElement` | `string`
- Default: `null`
- Required: `false`

## Usage

The Injex React plugin is slightly different from the other plugins, although you can use it without creating a plugin instance; here is a basic usage example.

```ts
import { Injex } from "@injex/webpack";
import { ReactPlugin } from "@injex/react-plugin";

Injex.create({
    resolveContext: () => require.context(__dirname, true, /\.tsx?$/),
    plugins: [
        new ReactPlugin({
            rootElementOrSelector: "#root"
        })
    ]
}).bootstrap();
```

The `rootElementOrSelector` option tells the plugin where is the root container element for rendering the application, this is not a mandatory configuration and it's relevant only if you're going to use the `renderInjexProvider` method as described below.

### The `renderInjexProvider` method

The most straightforward and easy way to use the plugin is by rendering your application using this injectable method. It will render your root component inside an Injex provider so you can use the `useInjex()` hook anywhere in your React application components.

```tsx
import * as React from "react";
import { bootstrap, IBootstrap, inject } from "@injex/core";
import { RenderInjexProvider } from "@injex/react-plugin";
import App from "components/app";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private renderInjexProvider: RenderInjexProvider;

    public run() {
        this.renderInjexProvider(<App />);
    }
}
```

The `renderInjexProvider` injectable method accepts two arguments. The first is the Root component we want to render into the container provided in the `rootElementOrSelector` plugin option. The second argument is optional, and it accepts the root element for rendering the component in case the `rootElementOrSelector` option was not provided; this will allow using the method multiple times with different root elements.

The method will render your root component inside an `InjexProvider` component to enable the use of the `useInjex()` hook.

### Manually rendering the `InjexProvider`

Sometimes you'll want to render the `InjexProvider` by yourself. Injex React plugin exposes the `InjexProvider` so you can use it while rendering your application. The provider accepts only one prop, the Injex runtime container itself, and you can access it using the `@inject()` decorator.

```ts
import * as React from "react";
import { render } from "react-dom";
import { bootstrap, IBootstrap, inject } from "@injex/core";
import { InjexProvider } from "@injex/react-plugin";
import App from "components/app";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private $injex;

    public run() {
        render(
            <InjexProvider container={this.$injex}>
                <App />
            </InjexProvider>,
            document.getElementById("root")
        );
    }
}
```

### Using the `useInjex()` hook

The `useInjex()` hook is the core of the Injex React plugin, making it possible to inject dependencies from your runtime container directly into your application components inside the `InjexProvider`.

Lets say you have a singleton session manager with a `currentUser` as a property:

```ts
import { define, singleton } from "@injex/core";

@define()
@singleton()
export class SessionManager {
    public get currentUser() {
        return {
            name: "Udi Talias",
            url: "https://twitter.com/uditalias"
        };
    }
}
```

You can inject it into your application components using the `useInjex()` hook:

```tsx
import * as React from "react";
import { useInjex } from "@injex/react-plugin";

export default function App() {

    const [inject, injectAlias] = useInjex();

    // inject the singleton instance of the SessionManager
    const session = inject("sessionManager");

    return (
        <h1>
            Hello, <a href={session.currentUser.url}>{session.currentUser.name}</a>
        </h1>
    );
}
```

Note that `useInjex()` exposes two functions inside an array. The first is `inject`, which works the same as the `@inject()` decorator, and the second is the `injectAlias` that works the same as the `@injectAlias()` decorator.

If you want a quick demo to play with, check out the [react example](/docs/examples#react-plugin-example) in the examples section.