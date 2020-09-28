---
id: bootstrap
title: "Bootstrap Decorator"
sidebar_label: "@bootstrap"
slug: /api/core/decorators/bootstrap
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Class%20Decorator-blue?style=for-the-badge" />

An application should have an entry point from where it should start running. When working with the Injex framework, you can choose to define a class as the bootstrap class, and it will become the entry point for your Injex application.

Injex bootstrap class should implement the [`IBootstrap`](/docs/api/core/enums-interfaces#ibootstrap) interface, and the Injex runtime will call the `run` method after all module initializations are done.

## Usage

To use the `@bootstrap()` decorator, put it above an exported class that implements the [`IBootstrap`](/docs/api/core/enums-interfaces#ibootstrap) interface. Please note that you should use this decorator only once in your application. Using this decorator over multiple classes will throw an error.

```ts {3}
import { bootstrap } from "@injex/core";

@bootstrap()
export class Bootstrap implements IBootstrap {
    public run(): void | Promise<void> {
        console.log("bootstrap complete");
    }

    public didCatch(e: Error): void {
        console.log("bootstrap error");
    }
}
```

:::note
Notice that when decorating a class using the `@bootstrap()` decorator, there is no need to use the `@define()` method for this class.
:::