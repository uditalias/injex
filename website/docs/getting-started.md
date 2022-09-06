---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
slug: /getting-started
---

Injex is a set of npm packages under the `@injex` npm scope.

## Requirements

- [Node.js](https://nodejs.org/en/) version >= 8.17.0
- [TypeScript](https://www.typescriptlang.org/) version >= 3.0.0

## Installation

Injex can be installed via [NPM](https://www.npmjs.com/) or [YARN](https://yarnpkg.com/). The first package to install is the core package; it includes the main functionality of Injex. Most of your work will be with this package.

```bash npm2yarn
npm install --save @injex/core
```

After installing the core package, you will need to install an Injex runtime. A runtime implements the functionality of loading files and modules into the Injex container. For example, the Node runtime defines the root directories for modules, while the Webpack/Vite runtimes defines the context for modules.

If you're working on a server-side project, install the Node runtime:

```bash npm2yarn
npm install --save @injex/node
```

If your project is a client-side project with Webpack/Vite bundlers, install the relevant runtime:

```bash npm2yarn
npm install --save @injex/webpack
```
Or
```bash npm2yarn
npm install --save @injex/vite
```

:::info
When working on a hybrid application (server and client), you can install more than one runtime.
:::

Read on to learn more about Injex runtimes and how to create a container on each one of them.
