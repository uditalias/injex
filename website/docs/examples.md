---
id: examples
title: Examples
sidebar_label: Examples
slug: /examples
---

A list of examples and instructions how to run them. All examples exists inside [Injex's GitHub repository](https://github.com/uditalias/injex) under the `examples/` folder.

First, clone the repository to your local machine

```bash
git clone git@github.com:uditalias/injex.git
```

After the clone is done, run the following commands inside the cloned folder

```bash
cd injex
npm install
npx lerna bootstrap
```

When everything's done, go to the folder of the example you want to play/run.

## Node runtime example

Example of how to create and use the Node runtime.

```bash
cd examples/injex-node-example/
npm run tsc
npm start
```

## Webpack runtime example

Example of how to create and use the Webpack runtime.

```bash
cd examples/injex-webpack-example/
npm start
```

Then open [http://localhost:3005](http://localhost:3005) in your browser

## Express plugin example

Example of how to create and use the Node runtime with the Express Plugin.

```bash
cd examples/injex-express-plugin-example/
npm run tsc
npm start
```