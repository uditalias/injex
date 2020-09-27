---
id: singleton
title: "Singleton Decorator"
sidebar_label: "@singleton"
slug: /api/core/decorators/singleton
---

<img class="decorator-badge" src="https://img.shields.io/badge/Type-Class%20Decorator-blue?style=for-the-badge" />

The [singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern) allows us to restrict a class's instantiation to a single instance during a program's lifecycle.

When using the `@singleton()` decorator to decorate a class, Injex will ensure you get the same instance of this class whenever you inject it into another module.

## Usage

To use the `@singleton()` decorator, put it above an exported class.

```ts {4}
import { define, singleton } from "@injex/core";

@define()
@singleton()
export class MyService {

}
```

:::note
Injex decorators can be used in any order.
:::