<img src="/assets/logo.png" width="150" align="right" />

# Quick start

Lets start by creating an Injex container to manage our modules and dependencies, you can think of a container as a big box with all your project modules (classes) inside of it. Once created and bootstraped, you don't have to interact with it any more, everything will just work as you will see in the following sections.


### Create Injex container
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

&larr; [Go back home](/README.md)