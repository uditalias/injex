---
id: container
title: Container API
sidebar_label: Container API
slug: /api/core/container
---

The runtime container is the central part of the Injex framework. With the core decorators, you define and manage the modules and their dependencies.

Although Injex's API is minimal and easy to follow, there are a few things you should keep in mind while working with this fantastic framework.

### A singleton class injectable name

When you create a singleton class using the `@singleton()` decorator, a camelCased representation of the class name is used as its injectable name.

```ts
@define()
@singleton()
export class MailService { ... }
```

The name of the class is **MailService** (with a capital 'M'), but the injectable name will be **mailService**, so to inject this module, we should do:

```ts {4}
@define()
@singleton()
export class MailSender {
    @inject() private mailService;
}
```

### File module exports

For Injex to run and scan all the modules inside your project files, you should export your classes this way:

```ts
@define()
export class MyModule { ... }

@define()
export class MyOtherModule { ... }

// or

@define()
class MyModule { ... }

@define()
class MyOtherModule { ... }

export { MyModule, MyOtherModule };
```

:::note
You can have multiple classes defined and exported from the same file.
:::

### Module access in constructors

Since Injex handles circular dependencies for you, one caveat is that you can't access injectable dependencies from module class constructors. Injex offers the [`@init()`](/docs/api/core/decorators/init) decorator to bypass this limitation.

## API

The runtime container exposes a small API you can use to handle dependencies. To get the runtime container instance, you call the `create()` method.

For example:

```ts
const container = await Injex.create({ ... }).bootstrap();

// access to the runtime container API
```

## Properties

### `container.logger`

Access the internal runtime container logger.

Methods: `info(...args)`, `debug(...args)`, `warn(...args)`, `error(...args)`

## Methods

### `container.bootstrap()`

Bootstraps and initialize the runtime container and all the registered modules.

- Returns: The container instance
- Async: `true`

### `container.getModuleDefinition(moduleNameOrType)`

Get a module metadata and its instance/factory method.
The `module` object inside the definition returned can be an instance of a class (if it's a singleton module) or a factory method to create its instance.

- Returns: `{ metadata, module }`
- Async: `false`

For example, if we have a module which defined this way:

```ts
@define()
@singleton()
export class MyService {
    public sayHello() {
        console.log("Hello World!");
    }
}
```

You can access the modue in this way:

```ts
const definition = container.getModuleDefinition("myService");
// or
const definition = container.getModuleDefinition(MyService);

definition.module.sayHello();
// "Hello World!"

console.log(definition.metadata);
// { dependencies: [], aliasDependencies: [], singleton: true, name: "myService", item: [class MyService] }
```

### `container.addObject(obj, name)`

Adds an object into the runtime container.

- Returns: The container instance
- Async: `false`
- Arguments:
    - `obj` - the object you wish to add
    - `name` - the injection name of the object

For example:

```ts {2,9}
Injex.create({ ... })
    .addObject({ name: "Udi Talias", email: "udi.talias@gmail.com" }, "author")
    .bootstrap();

// then you can access this object from one of your modules.
@define()
@singleton()
export class MyService {
    @inject() private author;

    @init()
    public initialize() {
        console.log(this.author); // { name: "Udi Talias", email: "udi.talias@gmail.com" }
    }
}
```

### `container.removeObject(name)`

Removes an object from the runtime container

- Returns: The container instance
- Async: `false`
- Arguments:
    - `name` - the injection name of the object

### `container.get(itemNameOrType)`

Get a module from the runtime container, which can be an instance of a class (if it's a singleton module) or a factory method to create its instance.