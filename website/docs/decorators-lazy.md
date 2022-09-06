---
id: lazy
title: "Lazy Decorator"
sidebar_label: "@lazy"
slug: /api/core/decorators/lazy
---

<img class="decorator-badge" src="https://img.shields.io/badge/Type-Class%20Decorator-blue?style=for-the-badge" />

When working on a big scaled application, sometimes you want to load and asynchronously instantiate part of it. If you worked on a big client-side application with a bundler like Webpack or Vite, you probably know how [code-splitting](https://webpack.js.org/guides/code-splitting/) works.

If you read about Injex's [Webpack Runtime](/docs/runtimes/webpack), you noticed that we use `require.context()` and with [Vite Runtime](/docs/runtimes/vite) we use `import.meta.glob()` to load the files inside the project. The problem with this approach is that we're bundling all the code together.

With the `@lazy()` decorator you create a class that implements the [`ILazyModule`](/docs/api/core/enums-interfaces#ilazymodule) interface. The `import` method should load and return a Constructor inside a Promise, then the constructor is called with args you pass in. You can use the `import` method for lazy-loading the code.

## Usage

To use the `@lazy()` decorator, put it above an exported class that implements the [`ILazyModule`](/docs/api/core/enums-interfaces#ilazymodule) interface. Lines 9 and 11 will create a chunk using Webpack's/Vite's code-splitting feature.

```ts {4,9,11}
import { define, lazy, ILazyModule, IConstructor } from "@injex/core";

@define()
@lazy()
export class CreatePage implements ILazyModule<IPage> {
    public async import(pageType: "home" | "profile"): Promise<IConstructor<IPage>> {
        switch(pageType) {
            case "home":
                return (await import("./pages/home")).HomePage;
            case "profile":
                return (await import("./pages/profile")).ProfilePage;
        }
    }
}
```

```ts title="home.lazy.ts"
import { define, inject } from "@injex/core";

/**
 * This file will be lazy loaded
 */
@define()
export class HomePage implements IPage {
    @inject() private env;

    public render(): string {
        return `<H1>Home Page</H1>`;
    }
}
```

And finally, use the CreatePage lazy module from anyware

```ts
import { define, singleton, inject } from "@injex/core";

@define()
@singleton()
export class PageRenderer {
    @inject() privatge createPage: () => Promise<IPage>;

    public async render() {
        // calling `this.createPage("home")` will load the HomePage module chunk asynchronously.
        const home = await this.createPage("home");

        document.getElementById('root').innerHTML = home.render();
    }
}
```

## Prevent lazy modules from beeing bundled