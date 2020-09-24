---
id: env-plugin
title: Env Plugin
sidebar_label: Env Plugin
slug: /plugins/env
---

<img src="https://img.shields.io/npm/v/@injex/env-plugin" />

The Env Plugin defines and manages multiple environment variables based on the `process.env.NODE_ENV` variable, with a fallback to default variables option.

The plugin adds the relevant environment object to the runtime container so you can inject it into any module as a dependency.

This is NOT a runtime specific plugin and can be used on all runtimes.

## Installation

You can install the Env Plugin via NPM or Yarn.

```bash npm2yarn
npm install --save @injex/env-plugin
```

## Usage

Example usage with the node runtime.

Creating the plugin and passing it to the container creation config object

```ts {7-21}
import { Injex } from "@injex/node";
import { EnvPlugin } from "@injex/env-plugin";

Injex.create({
    rootDirs: [__dirname],
    plugins: [
        new EnvPlugin({
            name: 'env',
            current: "production",
            defaults: {
                myVar: 123
            },
            environments: {
                development: {
                    logLevel: "verbose"
                },
                production: {
                    logLevel: "silence"
                }
            }
        })
    ]
});
```

Injecting the environment object created by the plugin into other module

```ts {4}
@define()
@singleton()
export class MyService {
    @inject() private env;

    @init()
    public initialize() {
        console.log(this.env.logLovel); // "silence"
        console.log(this.env.myVar); // 123
    }
}
```

## Configurations

You can pass the following configurations to the EnvPlugin

### `name`

The environment object name in the runtime container for later injection.

* Type: `string`
* default: `env`
* Required: `false`

### `current`

Enforce an environment by its name.

* Type: `string`
* default: `process.env.NODE_ENV`
* Required: `false`

### `defaults`

An object with default values to be used as a fallback to the selected environment.

* Type: `object`
* default: `{}`
* Required: `false`

### `environments`

An object contains the evironments and their variables.

For example:

```ts
const plugin = new EnvPlugin({
    ...
    environments: {
        development: {
            arg1: 1,
            arg2: 2
        },
        production: {
            arg1: 3,
            arg2: 4
        },
        test: {
            arg1: 5,
            arg2: 6
        }
    }
});
```

* Type: `object`
* default: `{}`
* Required: `false`