---
id: init
title: "Init Decorator"
sidebar_label: "@init"
slug: /api/core/decorators/init
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Method%20Decorator-purple?style=for-the-badge" />

Since Injex handles circular dependencies for you, one caveat is that you can't access injectable dependencies from module class constructors. Instead, you can use the `@init()` decorator to run module initialization upon creation.

## Usage

You use the `@init()` decorator by decorating a module class method to behave as the initialize method. This method is called by the Injex runtime after all the modules created and instantiated.

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

### Inheritance

You can use multiple `@init()` methods when you inherit from a parent class, this way, you can benefit the auto-initialization in multiple classes.

For example:

```ts {6,14}
import { define, init } from "@injex/core";

export abstract class Animal {
    @inject() protected logger;

    @init()
    public initializeAnimal() {
        this.logger.info('Animal created.');
    }
}

@define()
export class Fox extends Animal {
    @init()
    public initializeFox() {
        this.logger.info('Fox created.');
    }
}
```

The initialization method invokes order is from the parent class to the inherited class, just like when you use a `super()` constructor.

### Async/Await

Notice that you may return a promise from the initialization method if you like; Injex will "await" for it and return its promise from the factory method.

For example:

```ts
import { define, init, AsyncFactory } from "@injex/core";

@define()
export class Zebra extends Animal {
    private _metadata: IAnimalMetadata;

    @init()
    public async initialize() {
        this._metadata = await loadSomeData('zebra');
    }
}

@define()
@singleton()
export class Zoo {
    @inject(Zebra) zebraFactory: AsyncFactory<Zebra>;

    private _animals: Animal[];

    constructor() {
        this._animals = [];
    }

    @init()
    public async initialize() {
        // zebra instance resolved when it's `@init()` method finishes loading
        const zebra = await this.zebraFactory();

        this._animals.push(
            zebra
        );
    }
}
```