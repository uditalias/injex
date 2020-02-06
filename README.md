<img src="assets/logo.png" width="228" /> <a href="https://github.com/langauge/langauge"><img src="http://badge.langauge.io/uditalias/injex" align="right" /></a>

_Simple dependency-injection container for Node JS apps_

---

[![npm version](https://badge.fury.io/js/injex.svg)](https://badge.fury.io/js/injex)
[![Build Status](https://travis-ci.org/uditalias/injex.svg?branch=master)](https://travis-ci.org/uditalias/injex)
[![codecov](https://codecov.io/gh/uditalias/injex/branch/master/graph/badge.svg)](https://codecov.io/gh/uditalias/injex)

## Core concept

Injex has only one core concept, to define, inject and manage module dependencies.


## Install

Install Injex using NPM or Yarn:

```bash
npm install --save injex
```
Or
```bash
yarn add injex
```

## How it works

Injex create dependency tree between your modules in a simple way, using TypeScript decorators you can define, configure and inject modules into other modules as dependencies.

## Requirements

 In order to use Injex, your project should use TypeScript with `experimentalDecorators` compiler flag set to `true`, for more information about this flag, read the TypeScript docs about [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).  

Each defined module should be exported from it's file so Injex can find and register it.

## A quick start

Lets start by creating an Injex container to manage our modules and dependencies, once created and bootstraped, you don't need to interact with it any more, everything will just work.


### Creating new Injex container
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

We created Injex container (1) with the `./src` as our project root directory (2), the bootstrap method, once invoked, finds all the modules, creates the dependency tree and injects dependencies to the relevant modules.
  
Lets take a look how a module is defined and configured with it's dependencies via a simple example.

### Defining a module
```typescript
// src/mail.ts

@define()
export class Mail {
	constructor(public message: string) {

	}
}
```

This is it, Injex defined the module and now we can inject it to other modules or get it directly from Injex, but first thing first, lets use the container to get the Mail module.

### Using the container to get a defined module
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

### Using Singleton and Init decorators
```typescript
// src/mailService.ts

import { define, singleton, init } from "injex";

interface IMailService {
	send(mail: Mail): void;
}

@define()
@singleton()
export class MailService implements IMailService {

	@init()
	public initialize() {
		console.log("Connecting to SMPT server...");
		...
	}

	public send(mail: Mail) {
		console.log("Sending message: " + mail.message);
	}
}
```

The `MailService` defined as singleton with the `@singleton()` decorator. Notice the use of the `@init()` decorator above the `initialize` method, this method will be invoked when the MailService is created by Injex. You can return a `Promise` or use `async/await` in order to support asyncronious initialization.

Now lets take a look how we can inject the MailService as a module dependency.

### Connecting all the dots with the Inject decorator
```typescript
// src/mailManager.ts

import { define, singleton } from "injex";

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

As the `MailService`, the `MailManager` is also defined as a singleton module, the `@inject()` decorator injects the `mailService` and the `createMail` factory method as the MailManager dependencies.


```typescript
// index.ts

// ... after container bootstrap ...

const mailManager = container.get<MailManager>("mailManager");

mailManager.sendMessage("The answer to the question of life, the universe and everything!");

// Prints out:
// Sending message: The answer to the question of life, the universe and everything!
```

## Manually add or remove object

Sometimes you want to add objects to the container manually, you can use the `addObject` container method like so:

```typescript

const car = {
	model: "Ford",
	type: "Mustang",
	color: "Black"
};

container.addObject(car, "myCar");

expect(container.get("myCar")).toStrictEqual(car);

container.bootstrap();
```

Now you can inject "myCar" into other modules using the `@inject()` decorator.

```typescript
@define()
@singleton()
export class CarService {

	@inject() private myCar: ICar;

	@init()
	public initialize() {
		console.log(myCar.type); // Mustang
	}

}
```

To remove an object, use the `removeObject` container method:

```typescript
container.removeObject("myCar");

expect(container.get("myCar")).toBeUndefined();
```

## Container creation config

When creating new Injex container, you can use the following configurations:

```typescript
const container = await Injex.create({
	rootDirs: [
		process.cwd()
	],
	logLevel: LogLevel.Error,
	logNamespace: "Injex",
	globPattern: "/**/*.js"
});
```

`rootDirs: string[];`  
- Specify list of root directories to be used when resolving modules.  
Default: `[process.cwd()]`

`logLevel: LogLevel;`  
- Set Injex's logger level  
Possible value:
`LogLevel.Error`,
`LogLevel.Warn`,
`LogLevel.Info`,
`LogLevel.Debug`  
Default: `LogLevel.Error`

`logNamespace: string;`
- Set Injex's log namespace. The namespace will be included in each log.  
Defualt: `Injex`

`globPattern: string;`
- When resolving modules on `rootDirs`, this glob will be used to find the project files.  
Default: `/**/*.js`

**All the container options are optional**

## Decorators

### `@define()`
- Defines a class as a module using the camel cased version of the class name, or with a name argument passed to the decorator (`@define("myModule")`)

### `@singleton()`
- Set a module as a singleton, the same instance will return on each `@inject()` or `get()`.

### `@init()`
- Define an init method for a module. This method will be called in the bootstrap phase. The method can return a Promise.

### `@bootstrap()`
- A class with this decorator will invoke it's `run` method at the end of the bootstrap container phase, after all modules initialized. You don't need to use @define() or @singleton() decorators when you use @bootstrap(), since the bootstrap decorator automatically defined as a singleton module. For Example:
```typescript
@bootstrap()
export class ProjectBootstrapModule implements IBootstrap {

	@inject() private mailManager: MailManager;

	public async run(): Promise<void> {
		await this.someAsyncTask();

		this.mailManager.sendMessage("Bootstrap complete.");
	}
}
```
Note that the `run` method can return a `Promise` for async bootstrap.

### `@inject()`
- Injects a module as a dependency into another module. You can use the module name or its type. For example:
```typescript
@define()
class Mail {
	...
}

@define()
@singleton()
export class MailManager {

	// Inject a factory method using the module type
	@inject(Mail) craeteMail: (message: string) => Mail;

	// Inject a factory method using the module name
	@inject("mail") craeteMail: (message: string) => Mail;
}
```

## Public container methods

### `bootstrap()`
- Bootstraps the container, creates singletons, factory methods and injects dependencies.  
**Note** that this method may throw `DuplicateDefinitionError` if there are module duplications or `InitializeMuduleError` if there is an error in one of the `@init` methods.

### `get<T>([name])`
- Lookup and retrieve a module by it's name. Returns `undefined` if the module is not exist.

### `addObject<T>([object, name])`
- Add an object to the container with the given name.  
**Note** that this method will throw an `DuplicateDefinitionError` if the module is already defined.

### `removeObject<T>([name])`
- Removes an object by its name.

---

[![npm version](https://badge.fury.io/js/injex.svg)](https://badge.fury.io/js/injex)
[![Build Status](https://travis-ci.org/uditalias/injex.svg?branch=master)](https://travis-ci.org/uditalias/injex)
[![codecov](https://codecov.io/gh/uditalias/injex/branch/master/graph/badge.svg)](https://codecov.io/gh/uditalias/injex)

## Having an issue? A feature idea? Want to contribute?
Feel free to open an [issue](https://github.com/uditalias/injex/issues/new)  or create a [pull request](https://github.com/uditalias/injex/compare)
