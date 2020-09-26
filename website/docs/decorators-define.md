---
id: define
title: "Define Decorator"
sidebar_label: "@define"
slug: /api/core/decorators/define
---

The Define decorator is the most used decorator when working with the Injex framework. With this decorator, you define and register a class as a module inside the runtime container.

When you decorate a class with `@define()`, the class's name is transformed into a camel-case, and this will be the name you use to inject it.

For exmpale:

- `MyService` -> `myService`
- `UsersController` -> `usersController`

## Usage

To use the `@define()` decorator to define a class as a module, put it above an exported class.

```ts {3}
import { define } from "@injex/core";

@define()
export class MyService {

}
```

If you want a custom name for your module, you can pass it as an argument to the decorator.

```ts {3}
import { define } from "@injex/core";

@define("awesomeService")
export class MyService {

}
```