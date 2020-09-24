---
id: plugins
title: Plugins Concept
sidebar_label: Concept & Hooks
slug: /plugins
---

A good architecture is the one that let you extend a program functionality without changing it's core. With Injex plugins you can leverage the dependency-injection mechanism to implement new features around it.

The Injex framework exposes hooks you can bind to in order to create a rich experience for you and for other developers using Injex.

For example, you can inject new modules from your plugin into a container and access them from any module in your project that shares the same container.

In the next sections you'll lean how to create a new Plugin for Injex and find out about some of the Plugins already exists.

:::info
If you created a new plugin, let us know by creating a new [issue](https://github.com/uditalias/injex/issues/new) and we'll consider adding it to the plugin list section.
:::

## Anatomy

An Injex plugin is a JavaScript object or a class that implements the `IInjexPlugin` interface. This interface has only the `apply` method. This method is called by the Injex runtime with a container as an argument to bind into its hooks.

```ts title="NotifyBeforeInstanceCreationPlugin.ts"
export default class NotifyBeforeInstanceCreationPlugin {
    public apply(container: Injex<any>) {
        container.hooks.beforeCreateInstance.tap((construct, args) => {
            console.log(`Initializing "${construct.name}" with args ${args.join(",")}...`);
        });
    }
}
```

The `apply` method receives only one argument - the runtime container. You can bind to the container hooks or manually inject modules into it to be accessed by your application later on with the `@inject()` decorator.

## Usage

Plugins should be passed into the container creation object using the `plugins` array. for example:

```ts {3-6}
Injex.create({
    ... more configurations ...
    plugins: [
        new NotifyBeforeInstanceCreationPlugin(),
        ... more plugins ...
    ]
})
```

## Container Hooks

The runtime container is the core of the Injex framework that creates and manage the application modules. In order to extend the functionality with plugins, the runtime container exposese hooks. The following exposed hooks can be accessed in this way:

```ts
container.hooks.hookName.tap((...args) => {
    // Your Plugin implementation
});
```

### `beforeRegistration`

Called after all plugins created and just before files has been loaded.

### `afterRegistration`

Called after all files has been registered to the runtime container and before modules has been created.

### `beforeCreateModules`

Called just before the process of creating modules.

### `beforeCreateInstance`

Called before a module instance is created (as a singleton or by a factory method).

```ts
container.hooks.beforeCreateInstance.tap((Constructor, args: any[]) => {

});
```

- Callback Parameters: `Constructor`, `args`
    - `Constructor` - The module constructor
    - `args` - An array of constructor arguments.

### `afterModuleCreation`

Called after a module created. If it's a singleton module, an instance as been created and if it's not, a factory method was created.

```ts
container.hooks.afterModuleCreation.tap(({module, metadata}) => {

});
```

- Callback Parameters: `{ module, metadata }`
    - `module` - The actual instance of factory method.
    - `metadata` - a collection of metadata saved by the Injex runtime.

### `afterCreateModules`

Called after all modules has been created.

### `bootstrapRun`

Called after all modules created and the initialized [`@init()`](/docs/api/core/decorators/init) method (if defined) has been called.

### `bootstrapComplete`

Called after bootstrap is completed and the [`@bootstrap()`](/docs/api/core/decorators/bootstrap) module `run` method has completed successfully.

### `bootstrapError`

Called if there is an error in the bootstrap or module initialization process.

- Callback Parameters: `Error`
    - `Error` - the error thrown by the bootstrap process.

```ts
container.hooks.bootstrapError.tap((err: Error) => {

});
```