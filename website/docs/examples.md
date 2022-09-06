---
id: examples
title: Examples
sidebar_label: Examples
slug: /examples
---

Here is a list of examples and instructions to run them. All examples exist inside [Injex's GitHub repository](https://github.com/uditalias/injex) under the `examples/` folder.

First, clone the repository to your local machine

```bash
git clone git@github.com:uditalias/injex.git
```

After the clone is done, run the following commands:

```bash
cd injex
npm install
npx lerna bootstrap
```

When done, go to the example folder you want to run.

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

## Vite runtime example

Example of how to create and use the Vite runtime.

```bash
cd examples/injex-vite-example/
npm start
```

Then open [http://localhost:5173](http://localhost:5173) in your browser

## Express plugin example

Example of how to create and use the Node runtime with the Express Plugin.

```bash
cd examples/injex-express-plugin-example/
npm run tsc
npm start
```

## React plugin example

A chat application using Injex React Plugin with Injex Webpack runtime.

```bash
cd examples/injex-react-plugin/example/
npm start
```

Then open [http://localhost:3006](http://localhost:3006) in your browser

You can test a live demo of the chat application at [https://chat.injex.dev](https://chat.injex.dev)