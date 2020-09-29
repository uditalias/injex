---
id: lifecycle
title: Bootstrap Lifecycle
sidebar_label: Bootstrap Lifecycle
slug: /api/core/bootstrap-lifecycle
---

This section describes the runtime container lifecycle from invoking the `bootstrap()` method to the run completion.

## The `bootstrap()` method

After creating the container with `Injex.create({ ... })` you should call the `container.bootstrap()` method. This method creates all the modules and dependencies inside the container.

## Create & apply all plugins

The first bootstrap action is to create and apply all the plugins provided to the `plugins` options array.

## Loading container files

After plugins are ready, the container loads the relevant project files and collects metadata from each of them for later use.

## Create modules

In this phase, the container creates all the module instances and factory methods and saves them in the injectables registry.

## Initialize modules

Injecting dependencies and invoke the `@init()` methods for all the relevant modules.

## Invoke `run` or `didCatch` method

If the `@bootstrap()` decorator used for a Bootstrap class, the `run()` method invoked if everything is ok; otherwise, the `didCatch()` bootstrap method invoked with an error.