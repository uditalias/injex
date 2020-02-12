<img src="/assets/logo.png" width="180" align="right" />

# Quickstart

Let's start with the creation of an Injex container to manage our modules and dependencies, you can think of a container as a big box with all your project modules (classes) inside of it. Once created and bootstrapped, you don't have to interact with it anymore.


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
	
	// 3. Calling bootstrap will create and inject dependencies.
	.bootstrap()

})();
```

We created Injex container (1) with the `./src` as our project root directory (2), the bootstrap method, once invoked, finds all the modules, creates the dependency tree, and injects dependencies to the relevant modules.

**_Note_** - You can omit the `rootDirs` if all your files exists inside the `./src` folder. check out the [container setup](/README.md#container-setup-config) for more details.
  
Let's take a look at how a module is defined and configured with its dependencies via a simple example.

### Defining a module
```typescript
// src/mail.ts

@define()
export class Mail {
	constructor(public message: string) {

	}
}
```

That's all, Injex defined the module, and now we can inject it to other modules or get it directly from the Injex container, but first thing first, let's use the container to get the Mail module.

### Using the container to get a defined module
```typescript
// 1
const mailFactory = container.get<Mail>("mail");

// 2
const mail = mailFactory("hello, world!");

// 🎉
expect(mail.message).toBe("hello, world!");
```

What's going on? well, it's straightforward, first, we make access to our Injex container using the `container.get` method and requesting the "mail" module (1), this returns a factory method to create a new `Mail` instance.  

You may ask why we request "*_mail_*" and not "*_Mail_*"? By default, Injex's `@define()` decorator uses a camel-cased version of the class name, if you want to use something else, pass it to `@define()` as the first argument like this: `@define("myMail")`  

Second, we invoke the `mailFactory` method with arguments (the 'hello, world!' string literal), those get passed to the `Mail` constructor, and we get a new `Mail` instance.  

Now let's inject this factory method into a module without the container.

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

We define the `MailService` as a singleton with the `@singleton()` decorator. Notice the use of the `@init()` decorator above the `initialize` method; this method invokes when Injex creates the MailService. You can return a `Promise` or use `async/await` to support asynchronous initialization.

Now, let's take a look at how we can inject the MailService as a module dependency.

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

As the `MailService`, we also define the `MailManager` as a singleton module, the `@inject()` decorator injects the `mailService` and the `createMail` factory method as the MailManager dependencies.


```typescript
// index.ts

// ... after container bootstrap ...

const mailManager = container.get<MailManager>("mailManager");

mailManager.sendMessage("The answer to the question of life, the universe, and everything!");

// Prints out:
// Sending message: The answer to the question of life, the universe, and everything!
```

&larr; [Go back home](/README.md)