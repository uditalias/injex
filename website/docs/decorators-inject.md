---
id: inject
title: "Inject Decorator"
sidebar_label: "@inject"
slug: /api/core/decorators/inject
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Property%20Decorator-orange?style=for-the-badge" />

The main task of a dependency-injection framework is to inject modules as dependencies into other modules so that you could keep your code organized and reusable.

## Usage

Use the `@inject()` decorator to inject your pre-defined modules into others by decorating class properties that share the same name with a module.

```ts {6,9}
import { define, singleton, inject } from "@injex/core";

@define()
@singleton()
export class UsersManager {
    @inject() private usersService;

    public createUser(data) {
        this.usersService.create(data);
    }
}

// usersService.ts
@define()
@singleton()
export class UsersService {
    public create(data) { ... }
}
```

### Inheritance

Injectables are also inherited when you extend classes or abstractions, so if you have a class with injected dependencies, they are accessible from the inherited class.

For example, notice how we don't decorate the abstract `Animal` class with the `@define()` decorator since we don't instantiate it directly, but we can still use `@inject()`.


```ts title="animal.ts"
export abstract class Animal {
    @inject() protected logger;

    public abstract talk(): void;
}
```

The `Dog` class, which extends the abstract `Animal` class, accesses its parent's `logger` dependency.

```ts title="dog.ts"
@define()
export class Dog extends Animal {
    public talk() {
        this.logger.info("Woof Woof!");
    }
}
```

### Custom property names

Class property names should match the module names you inject so Injex could find them. It's not always the case; sometimes, you want to inject a module with a different name.

The `@inject()` decorator optionally accepts a module name or a type so that you can use a different name for your class properties.

```ts {6,9}
import { define, singleton, inject } from "@injex/core";

@define()
@singleton()
export class UsersManager {
    @inject("usersService") private service;

    public createUser(data) {
        this.service.create(data);
    }
}
```

### Factory vs. Singleton

As you may already saw, you can create modules as singletons with the [`@singleton()`](/docs/api/core/decorators/singleton) decorator. When you don't use a singleton for a module, it's injectable become a factory method you can call to create an instance.

```ts title="zebra.ts"
import { define } from "@injex/core";

@define()
export class Zebra extends Animal {
    constructor(name: string) {
        ...
    }
    ...
}
```

```ts {7,9} title="zoo.ts"
import { define, singleton, inject } from "@injex/core";
import { Zebra } from "./zebra";

@define()
@singleton()
export class Zoo {
    @inject(Zebra) private createZebra: (name: string) => Promise<Zebra>;
    // or
    @inject() private zebra: (name: string) => Promise<Zebra>;

    public spawnZebra(name: string): Promise<Zebra> {
        return this.createZebra(name);
    }
}
```

The factory method calls the constructor, so it accepts arguments.