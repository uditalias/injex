# Env Plugin

<img src="https://img.shields.io/npm/v/@injex/env-plugin?style=for-the-badge" />

The Env Plugin defines and manages multiple environment variables based on the `process.env.NODE_ENV` variable, with a fallback to default variables option.

The plugin adds the relevant environment object to the runtime container so you can inject it into any module as a dependency.

This is NOT a runtime specific plugin and can be used on all Injex's runtimes.

## Installation

You can install the Env Plugin via NPM

```bash
npm install --save @injex/env-plugin
```
or Yarn
```bash
yarn add @injex/env-plugin
```

## Initialization

Creating the plugin and passing it to the runtime container config object

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

## Configurations

You can pass the following configurations to the EnvPlugin.

### `name`

The environment object name, as it will be used in the runtime container for later injection.

* Type: `string`
* Default: `env`
* Required: `false`

### `current`

Enforce an environment by its name.

* Type: `string`
* Default: `process.env.NODE_ENV`
* Required: `false`

### `defaults`

An object with default values to be used as a fallback to the selected environment.

* Type: `object`
* Default: `{}`
* Required: `false`

### `environments`

An object contains the environments and their variables.

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
* Default: `{}`
* Required: `false`

## Usage

To inject the environment object created by the plugin into other modules using the `@inject()` decorator.

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