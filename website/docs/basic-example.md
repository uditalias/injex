---
id: basic-example
title: A basic Node application
sidebar_label: Basic Example
slug: /basic-example
---

In this section we are going to create a basic TypeScript Node application powered by the Injex framework. This example will overview the core functionality of Injex, including how to create an IoC container, define and inject modules and bootstrap your application.

At the end of this example you will have all the tools to get you up and running using Injex on your own
TypeScript applications, making it easier for you implementing paradigms like the [SOLID principles](https://hackernoon.com/solid-principles-made-easy-67b1246bcdf).

:::note
Check out the [Getting Started](/docs/getting-started) section if you havn't read it yet.
:::

# What we're going to build

We're going to build a mail sender service for Node. The app will receive a mail provider type, a message body and a contact email address to send the mail to.

:::note
This is just a demo application and it's not going to actually send anything. We are creating it for demonstration purpose.
:::

# Creating a Project

Let's start by creating a project folder and init the npm project.

```bash
mkdir injex-node-app
cd injex-node-app
```