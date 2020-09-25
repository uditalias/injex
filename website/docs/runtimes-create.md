---
id: runtimes-create
title: Create a Runtime
sidebar_label: Create a Runtime
slug: /runtimes/create-runtime
---

An Injex runtime defines the functionality needed to load modules automatically on a specific environment (or runtime).
As an example, the [Node runtime](/docs/runtimes/node) defines the functionality to load modules for a Node application.
As you may see, creating a new runtime is a simple task.

To create a new runtime, you'll need to inherit the `Injex` abstract class from the `@injex/core` package where most of the runtime functionality exists. All you need to do is implement two abstract functions, as you will see in a minute.

## Implementation

First, you need to make sure `@injex/core` is installed as a dependency on your runtime project.

```bash npm2yarn
npm install --save @injex/core
```

Now, create a file named `injex.ts` and paste the following code

```ts title="injex.ts"
import { Injex, IContainerConfig } from "@injex/core";

export interface MyInjexRuntimeConfig extends IContainerConfig {

}

export default class MyInjexRuntime extends Injex<MyInjexRuntimeConfig> {

    public static create(config?: MyInjexRuntimeConfig): MyInjexRuntime {
        return new MyInjexRuntime(config);
    }

    protected abstract createConfig(config: Partial<MyInjexRuntimeConfig>): MyInjexRuntimeConfig {
        
    }

    protected abstract loadContainerFiles(): void {

    }
}
```

You'll need to implement the `createConfig()` and the `loadContainerFiles()` abstract methods of the base Injex class.

### `createConfig()`

This method will get the config argument passed to the static `create` method and should return the full configurations for this runtime with default values as a fallback.

:::note Recommendation
The static `create()` method is not mandatory for the runtime to operate, but you want to implement it consistently with other runtimes.
:::

A config interface should extend the [`IContainerConfig`](#icontainerconfig-interface) interface, as you can see in line 3.

Example from the Node runtime:

```ts
interface INodeContainerConfig extends Partial<IContainerConfig> {
    rootDirs?: string[];
    globPattern?: string;
}
```

```ts
protected createConfig(config: Partial<INodeContainerConfig>): INodeContainerConfig {
    return {
        logLevel: LogLevel.Error,
        logNamespace: "Injex",
        plugins: [],
        rootDirs: [
            resolve(process.cwd(), "./src")
        ],
        globPattern: "/**/*.js",
        ...config
    };
}
```

Lines 3-5 are fallback values for the base `IContainerConfig` interface, lines 6-9 are the fallback values for the `INodeContainerConfig` interface and in line 10 we merge with the user config argument.

### `loadContainerFiles()`

The most important part of an Injex runtime is to load all module files in a project so Injex can scan those files for module definitions. You should call the `registerModuleExports()` internal method with the required file content.

Example from the Node runtime:

```ts
protected loadContainerFiles(): void {
    this.config.rootDirs
        .map((dir) => (this._throwIfRootDirNotExists(dir), getAllFilesInDir(dir, this.config.globPattern)))
        .reduce((allFiles: string[], files: string[]) => allFiles.concat(files), [])
        .forEach((filePath) => this.registerModuleExports(require(filePath)));
}
```

We load all files inside the `rootDirs` config with the node runtime, as shown in line 3. In line 5 we iterate and call the `registerModuleExports()` method for each file with the `require(filePath)` module as an argument, so Injex can scan it and look for module definitions.

### `IContainerConfig` interface

```ts
export interface IContainerConfig {
    logLevel?: LogLevel;
    logNamespace?: string;
    plugins?: IInjexPlugin[];
}
```

## Exporting a runtime

For consistency, export the runtime container you created in the `injex.ts` file under the name `Injex`.

As an example, this is how the Node and Webpack runtimes are imported:

import CodeBlock from '@theme/CodeBlock';

<Tabs values={[{label: "Node", value: "node"}, {label: "Webpack", value: "webpack"}, {label: "Yours", value: "yours"}]} defaultValue="node">
    <TabItem value="node">
        <CodeBlock className="ts">
            {`import { Injex } from "@injex/node";\n\nInjex.create({ ... });`}
        </CodeBlock>
    </TabItem>
    <TabItem value="webpack">
        <CodeBlock className="ts">
            {`import { Injex } from "@injex/webpack";\n\nInjex.create({ ... });`}
        </CodeBlock>
    </TabItem>
    <TabItem value="yours">
        <CodeBlock className="ts">
            {`import { Injex } from "your-runtime-package";\n\nInjex.create({ ... });`}
        </CodeBlock>
    </TabItem>
</Tabs>  

<br/>

:::note RECOMMENDATION
It's a good practice to go over the source code of an existing runtime before implementing yours. Injex's runtimes source code is located under the runtimes/ root folder inside [Injex's GitHub repository](https://github.com/uditalias/injex).
:::
