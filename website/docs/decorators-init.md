---
id: init
title: "Init Decorator"
sidebar_label: "@init"
slug: /api/core/decorators/init
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Method%20Decorator-purple?style=for-the-badge" />

Since Injex handles circular dependencies for you, one caveat is that you can't access injectable dependencies from module class constructors. Instead, you can use the `@init()` decorator to run module initialization upon creation.

## Usage

You use the `@init()` decorator by decorating a module class method to behave as the initialize method. This method is called by the Injex runtime after the class constructor.

```ts {16}
import { define, init } from "@injex/core";

@define()
export class Zebra extends Animal {

    @inject() private logger;
    private _name: string;

    constructor(name: string) {
        this._name = name;

        // `this.logger` and other injectables are not accessible
        // from the constructor, so their value is `undefined`.
    }

    @init()
    public initialize() {
        // you can access injectables
        this.logger.info(`Zebra ${this._name} created.`);
    }
}
```

:::note
Notice that you may return a promise from the initialization method if you like; the Injex runtime will "await" for this promise.
:::