# INJEX
_Simple dependency-injection container for Node JS apps_

[![Build Status](https://travis-ci.org/uditalias/injex.svg?branch=master)](https://travis-ci.org/uditalias/injex)
[![codecov](https://codecov.io/gh/uditalias/injex/branch/master/graph/badge.svg)](https://codecov.io/gh/uditalias/injex)
[![npm version](https://badge.fury.io/js/uditalias%2Finjex.svg)](https://badge.fury.io/js/uditalias%2Finjex)

## Install

Install Injex using NPM or Yarn:

```bash
npm install --save injex
```

```bash
yarn add injex
```

## How it works

Injex create dependency tree between your modules in a  simple way, using TypeScript decorators you can define, configure and inject modules into the container.

## Getting Started

Lets start by creating an Injex container to manage our modules and dependencies, once created and bootstraped, you don't need to interact with it any more, everything will just work.

```typescript
// index.ts

import { Injex } from "injex";
import * as path from "path";

(async function() {

	// 1. Create and bootstrap new Injex container
	const container = await Injex.create({
		rootDirs: [

			// 2. Define the root directories, where your modules exists.
			path.resolve(__dirname, "./src")
		]
	})
	
	// 3. Calling bootstrap will create and inject dependencies
	.bootstrap()

})();
```

* For more Container configurations see the docs.

We created Injex container (1) with the `./src` as our project root directory (2), the bootstrap method, once invoked, finds all the modules, creates the dependency tree and injects dependencies to the relevant modules.
  
Lets take a look how a module is defined and configured with it's dependencies via a simple example.

```typescript
// src/mail.ts

@define()
export class Mail {
	constructor(public message: string) {

	}
}
```

This is it, Injex defined the module and now we can inject it to other modules or get it directly from Injex, but first thing first, lets use the container to get the Mail module.

```typescript
// 1
const mailFactory = container.get<Mail>("mail");

// 2
const mail = mailFactory("hello, world!");

// 🎉
expect(mail.message).toBe("hello, world!");
```

Whats going on? well, it's very simple, first we make access to our Injex container using the `container.get` method and requesting the "mail" module (1), this will return a factory method to create a new `Mail` instance.  
You may ask why we request "*_mail_*" and not "*_Mail_*"? By default, Injex's `@define()` decorator will use a camel cased version of the class name, if you want to use something else, just pass it to `@define()` as the first argument like this: `@define("Mail")`  
Second, we invoke the `mailFactory` method with arguments (the 'hello, world!' strign literal), those gets passed to the `Mail` constructor and we get a new `Mail` instance.  

Now lets inject this factory method into a module without the container, lets define more modules.

```typescript
// src/mailService.ts

interface IMailService {
	send(mail: Mail): void;
}

@define()
@singleton()
export class MailService implements IMailService {

	public send(mail: Mail) {

		console.log("Sending message: " + mail.message);

	}

}
```

```typescript
// src/mailManager.ts

@define()
@singleton()
export class MailManager {

	@inject() private mailService: IMailService;
	@inject(Mail) private createMail: (message:string) => Mail;

	public sendMessage(message: string) {

		const mail = this.createMail(message);

		this.mailService.send(mail);
	}
}
```

```typescript
// index.ts

const mailManager = container.get<MailManager>("mailManager");

mailManager.sendMessage("The answer to the question of life, the universe and everything!");

// Prints out:
// Sending message: The answer to the question of life, the universe and everything!

```