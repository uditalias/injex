---
id: runtimes-node
title: Node Runtime
sidebar_label: Node
slug: /runtimes/node
---

The Node runtime creates a container for Node TypeScript applications.

## Installation

You can install the Node runtime via NPM or Yarn.

```bash npm2yarn
npm install --save @injex/core @injex/node
```

## Usage

### Create a container

#### `Injex.create({ ... })`

Creates a new Injex container.

```typescript
import { Injex } from "@injex/node";

Injex.create({
    // Configurations
});
```

Returns a new Injex container instance.

:::note
An Injex container instance is the same on all runtimes. Check out the [Container API](/docs/api/core/container) for more info.
:::

### Configurations

You can config the Node runtime using the following configurations.

#### `rootDirs`

A list of folders for modules lookup (recursive)

* Type: `Array`
* default: `[path.resolve(process.cwd(), "./src")]`
* Required: `false`

#### `globPattern`

Define the modules glob pattern

* Type: `string`
* default: `/**/*.js`
* Required: `false`

#### `logLevel`

Controls Injex's internal logger log level

* Type: [`LogLevel`](/docs/api/core/enums-interfaces#loglevel)
* default: `LogLevel.Error`
* Required: `false`

#### `logNamespace`

Set Injex's logger log lines prefix

* Type: `string`
* default: `Injex`
* Required: `false`

#### `plugins`

List of plugins to include with the container instance.

* Type: `Array`
* default: `[]`
* Required: `false`

:::tip A working Example
You can go to the [basic example](/docs/basic-example) to see the Node runtime in action.
:::