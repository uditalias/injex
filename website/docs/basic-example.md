---
id: basic-example
title: A basic Node application
sidebar_label: Basic Usage Example
slug: /basic-example
---

In this section we are going to create a basic TypeScript Node application powered by the Injex framework. This example will overview the core functionality of Injex, including how to create an IoC container, define and inject modules and bootstrap your application.

At the end of this example you will have all the tools to get you up and running using Injex on your own
TypeScript applications, making it easier for you implementing paradigms like the [SOLID principles](https://hackernoon.com/solid-principles-made-easy-67b1246bcdf).

:::note
Check out the [Getting Started](/docs/getting-started) section if you havn't read it yet.
:::

## What we're going to build

We're going to build a mail sender service for Node. The app will receive a mail provider type, a message body and a contact email address to send the mail to.

:::note
This is just a demo application and it's not going to actually send anything. We are creating it for demonstration purpose.
:::

## Scaffolding

Let's start by creating a folder and init an npm project.

```bash
mkdir -p injex-node-app/src
cd injex-node-app
npm init -y
touch src/index.ts
```

Now, lets install the dependencies we're going to use in our project.

```bash npm2yarn
npm install --save @injex/core @injex/node typescript @types/node
```

### TypeScript config

Copy this basic `tsconfig.json` file to the root folder.

```json title="tsconfig.json"
{
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./out",
        "module": "commonjs",
        "target": "es6",
        "experimentalDecorators": true
    },
    "exclude": [
        "node_modules"
    ]
}
```

### Package scripts

Edit the `package.json` file, replace the `"scripts": {...}` section with:

```json
{
    ...
    "scripts": {
        "dev": "tsc -w",
        "build": "tsc",
        "start": "node out/index"
    },
    ...
}
```

### Interfaces

We're going to use the `IMailProvider` Typescript interface later on, let's add it to a file called `interfaces.ts` inside the `src/` folder.

```ts title="src/interfaces.ts"
export interface IMailProvider {
    send(message: string, email:string): void;
}
```

## The mail providers

Now we are going to create 2 mail providers, `GoogleMailProvider` and `MicrosoftMailProvider` so we can send the mail message using GMAIL or MSN. Let's create 2 files inside the `src/providers/` folder.

```ts {4-6} title="src/providers/googleMailProvider.ts"
import { define, singleton, alias } from "@injex/core";
import { IMailProvider } from "../interfaces";

@define()
@singleton()
@alias("MailProvider")
export class GoogleMailProvider implements IMailProvider {
    public readonly Type = "google";

    public send(message: string, email: string) {
        console.log(`GMAIL: Sending message to ${email}...`);
        console.log(`GMAIL: ${message}`);
    }
}
```

```ts {4-6} title="src/providers/microsoftMailProvider.ts"
import { define, singleton, alias } from "@injex/core";
import { IMailProvider } from "../interfaces";

@define()
@singleton()
@alias("MailProvider")
export class MicrosoftMailProvider implements IMailProvider {
    public readonly Type = "microsoft";

    public send(message: string, email: string) {
        console.log(`MSN: Sending message to ${email}...`);
        console.log(`MSN: ${message}`);
    }
}
```

Both of the files are pretty the same except for minor changes. Just remeber this is not a real world mail sender service, so we just print some content to the console.

Let's go over the important lines (4, 5, 6):

In line 4 we define the provider class as an Injex module, this will register the class in the Injex container, line 5 marks this class as a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern), meaning that any time a module will "require" this provider, he will get the same instance of the mail provider.

In line 6 we tells Injex that each module has the alias name `MailProvider` so we can use the `@injectAlias(NAME, KEY)` decorator in order to inject a dictionary with all the modules with this alias as we will see in a minute.

## The mail service

Let's create a service called `MailService`, this service will have the `send` method wich receives the mail provider type, a message body and the address of our contact to send the message as arguments, and triggers the send method of the selected mail provider.

Create the file `services/mailService.ts` inside the `src/` folder and paste the following code.

```ts {4,5,7} title="src/services/mailService.ts"
import { define, singleton, injectAlias, AliasMap } from "@injex/core";
import { IMailProvider } from "../interfaces";

@define()
@singleton()
export class MailService {
    @injectAlias("MailProvider", "Type") private mailProviders: AliasMap<string, IMailProvider>;

    public send(provider: string, message: string, email: string) {
        const mailProvider = this.mailProviders[provider];
        mailProvider.send(message, email);
    }
}
```
Like before, let's go over the important lines (3, 4, 6):

Lines 3 and 4 should be familiar, we define and register the module and mark it as a singleton module.

In line 6, we tells Injex to inject all the modules with the `MailProvider` alias name into a dictionary called `mailProviders` wich is a member of the `MailService` class, the `"Type"` in line 7 tells Injex what will be the key for this dictionary (line 8 in our mail providers from before).

## Bootstrap

Like every application, we should have an entry point. Injex's entry point is the Bootstrap class `run` method.

Create the file `bootstrap.ts` inside our `src/` folder and paste the following.

```ts {4,6} title="src/bootstrap.ts"
import { bootstrap, inject } from "@injex/core";
import { MailService } from "./services/mailService";

@bootstrap()
export class Bootstrap {
    @inject() private mailService: MailService;

    public run() {
        this.mailService.send("google", "Hello from Injex!", "udi.talias@gmail.com");
    }
}
```

Line 1 defines this module as the bootstrap class, you should have only 1 class in your container with the `@bootstrap()` decorator.

In line 6 we tells Injex that we want to `@inject()` the `mailService` singleton module we created earlier so we can use it to send our so important email 😅.

:::note A Side Note
You probably asking yourself, how is the mailService on line 6 received the singleton instance of `MailService` (with the capital 'M'), the answer is that Injex takes the name of the module class (MailService) and convert it to it's camelCased version. You can read more about it on the [@inject()](/docs/api/core/decorators/inject) decorator docs.
:::

## The Injex container

The container is the main part of the Injex framework, this is where all your application module definitions, instances, factories and configurations will live for later injection.

We're going to use the Injex Node container, the one we installed earlier via the `npm install @injex/node` command.

Open the `src/index.ts` file in your favorite editor and paste the following code.

```ts title="src/index.ts"
import { Injex } from "@injex/node";

Injex.create({
    rootDirs: [__dirname]
}).bootstrap();
```

Here we import Injex from `@injex/node` and creates the container using the `Injex.create()` method, we pass the `__dirname` as the only root directory of our project so Injex can scan all the files inside this directory and look for Injex modules for auto registration.

This is one of the great parts of the Injex framework. You just need to create a module inside the root directory and Injex will find it automatically and wire everything for us. No need to add each module manually.

:::note
Check out the [Node](/docs/runtimes/node) runtime for more configuration options.
:::

## 3, 2, 1... lift off!

Ok, we came so far, let's start the engine and watch the magic.

Open your terminal and run the build command in order to transpile our TypeScript.

Make sure you're inside our project root folder and run the following commands.

```bash
npm run build && npm start
```

You should see the output:

```bash
GMAIL: Sending message to udi.talias@gmail.com...
GMAIL: Hello from Injex!
```

## Summary

We created a simple Node application to show the basic parts of Injex framework. We created a service and some classes with an alias name and injected them into the service using the `@injectAlias()` decorator.

We then created the bootstrap class and we used the MailService singleton instance that injected into it.

You can checkout the [examples](/docs/examples/node) section for more examples and use cases.