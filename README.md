<img src="website/static/img/poster.png"  />

<h1>
    Injex <img src="https://img.shields.io/npm/v/@injex/core" valign="middle" /> <img src="https://travis-ci.org/uditalias/injex.svg?branch=master" valign="middle" /> <a href="https://twitter.com/injex_framework"><img src="https://img.shields.io/twitter/url?label=%40injex_framework&style=social&url=https%3A%2F%2Ftwitter.com%2Finjex_framework" valign="middle" /></a>
</h1>
<h3>Simple, Decorated, Pluggable dependency-injection framework for TypeScript applications</h3>
<p>Injex makes software architecture more easy & fun by creating a dependency tree between your application modules with a minimal API.</p>

<h3 align="center">

[Home](https://www.injex.dev)
·
[Docs](https://www.injex.dev/docs/introduction)
·
[Runtimes](https://www.injex.dev/docs/runtimes/node)
·
[Plugins](https://www.injex.dev/docs/plugins)
·
[Examples](https://www.injex.dev/docs/examples)
</h3>

## Installation

Start by installing the core package. This package includes most of the functionality you're going to use when working with the Injex framework.

```bash
npm install --save @injex/core
```

After the core is installed and based on your project, you need to install a runtime container. The runtime container enables modules definition and registration across your application.

You can currently choose between the Node or Webpack runtimes for the server or the client, respectively.

#### Node Runtime

Create a dependency-injection container inside a Node.JS application.

```bash
npm install --save @injex/node
```

#### Webpack Runtime

Create a dependency-injection container inside a Webpack bundled client-side application.

```bash
npm install --save @injex/webpack
```

<img src="website/static/img/poster_twitter.png" />

## Getting Started

### Basic Usage

Create an Injex Node runtime container.

```typescript
import { Injex } from "@injex/node";

Injex.create({
    rootDirs: [
        "./src"
    ]
}).bootstrap()
```

Injex will scan all the files and folders recursively and look for Injex modules.

Module definition example:

```typescript
// src/services/mailService.ts
import { define, singleton, inject } from "@injex/core";

@define()
@singleton()
export class MailService {
    @inject() private mailProvider: IMailProvider;

    public sendMail(mail: Mail) {
        this.mailProvider.send(mail);
    }
}
```

Since Injex automatically scans all the files and folders inside the `rootDirs`, this is all you need to do to create an injectable module.

[Learn more >>](https://www.injex.dev/docs/getting-started)

### Plugins

Injex is pluggable, so you can use and create your plugins to enrich your applications.

📦 **Env Plugin** - Manage environment variables across your application. [Docs &#8594;](https://www.injex.dev/docs/plugins/env)

📦 **Express Plugin** - Use Injex to power up your Express application by creating controllers, better route handlers, and middlewares. [Docs &#8594;](https://www.injex.dev/docs/plugins/express)

📦 **React Plugin** - Use React hooks to inject dependencies into components. [Docs &#8594;](https://www.injex.dev/docs/plugins/react)

[Learn more](https://www.injex.dev/docs/plugins) about Injex plugins and the plugin anatomy.

## Follow Us

Follow us on [Twitter](https://twitter.com/injex_framework) or join our live [Discord](https://discord.gg/tqjz7f) server for more help, ideas, and discussions.

## Author

| [![twitter/uditalias](https://gravatar.com/avatar/838347acc4c97bfc938a2dac4043bd2a?s=70)](http://twitter.com/uditalias "Follow @uditalias on Twitter") |
|---|
| [Udi Talias](https://github.com/uditalias/) |

## License

This repository is available under the [MIT License](./LICENSE).