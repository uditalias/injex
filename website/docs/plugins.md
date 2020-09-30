---
id: plugins
title: Plugins Concept
sidebar_label: Concept & Hooks
slug: /plugins
---

Good architecture is the one that lets you extend a program functionality without changing its core. With Injex plugins, you can leverage the dependency-injection mechanism to implement new features around it.

The Injex framework exposes hooks you can bind to create a rich experience for you and other developers using Injex.

For example, you can inject new modules from your plugin into a container and access them from any module in your project that shares the same runtime container.

In the next sections, you'll learn how to create a new Plugin for Injex and discover the Plugins already exists.

:::info
If you created a new plugin, let us know by creating a new [issue](https://github.com/uditalias/injex/issues/new), and we'll consider adding it to the plugin list section.
:::

## Anatomy

An Injex plugin is a JavaScript object or a class that implements the [`IInjexPlugin`](/docs/api/core/enums-interfaces#iinjexplugin) interface. This interface has only the `apply` method. The Injex runtime calls this method with the runtime container as an argument so you can bind into its hooks.

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

The runtime container is the core of the Injex framework that creates and manages the application modules. To extend its functionality with plugins, the runtime container exposes hooks. You can bind those hooks in this way:

```ts
container.hooks.hookName.tap((...args) => {
    // Your Plugin implementation
});
```

### `beforeRegistration`

Called after all plugins created and just before files have loaded by the runtime.

### `afterRegistration`

Called after all files have registered to the runtime container and before modules have been created.

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

Called after a module created. If it's a singleton module, an instance has been created, and if it's not, a factory method has created.

```ts
container.hooks.afterModuleCreation.tap(({module, metadata}) => {

});
```

- Callback Parameters: `{ module, metadata }`
    - `module` - The actual instance of the factory method.
    - `metadata` - a collection of metadata saved by the Injex runtime.

### `afterCreateModules`

Called after all modules have been created.

### `bootstrapRun`

Called after all modules created and the initialized [`@init()`](/docs/api/core/decorators/init) method (if defined) has been called.

### `bootstrapComplete`

Called after bootstrap is completed, and the [`@bootstrap()`](/docs/api/core/decorators/bootstrap) module `run` method has completed successfully.

### `bootstrapError`

Called if there is an error in the bootstrap or module initialization process.

- Callback Parameters: `Error`
    - `Error` - the error thrown by the bootstrap process.

```ts
container.hooks.bootstrapError.tap((err: Error) => {

});
```