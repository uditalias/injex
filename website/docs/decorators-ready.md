---
id: ready
title: "Ready Decorator"
sidebar_label: "@ready"
slug: /api/core/decorators/ready
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Method%20Decorator-purple?style=for-the-badge" />

Using the `@ready()` decorator on a module method, invokes that method after the container bootstrap is complete.

As an example, when using the `@init()` decorator on a method, the method invokes as part of the container bootstrap. The `@ready()` decorator is for cases where you want to invoke a method when all modules initialization has complete.

## Usage

You use the `@ready()` decorator by decorating a module class method. This method is called by the Injex runtime after all the modules initialized and the bootstrap process has been complete.

```ts {5}
import { define, ready } from "@injex/core";

@define()
export class Zebra extends Animal {
    @ready()
    public initialize() {
        // container bootstrap complete and all modules initialized.
    }
}
```

### Bootstrap complete syntactic sugar

The `@ready()` decorator is a syntactic sugar to hooking a module method into the container `bootstrapComplete` hook.

For example:

```ts
import { define, init } from "@injex/core";

export class Animal {
    @inject() private $injex: Injex;

    @init()
    private _initialize() {
        this.$injex.hooks.bootstrapComplete.tap(this._onReady, null, this);
    }

    private _onReady() {
        // bootstrap complete.
    }
}
```

With `@ready()` decorator:

```ts
import { define, ready } from "@injex/core";

export class Animal {
    @ready()
    private _onReady() {
        // bootstrap complete.
    }
}
```


### Inheritance

You can use multiple `@ready()` methods when you inherit from a parent class.

For example:

```ts {6,14}
import { define, ready } from "@injex/core";

export abstract class Animal {
    @inject() protected logger;

    @ready()
    public onAnimalReady() {
        this.logger.info('Animal is ready.');
    }
}

@define()
export class Fox extends Animal {
    @ready()
    public onFoxReady() {
        this.logger.info('Fox is ready.');
    }
}
```