---
id: alias
title: "Alias Decorator"
sidebar_label: "@alias"
slug: /api/core/decorators/alias
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Class%20Decorator-blue?style=for-the-badge" />

Giving an alias name to a module allows us to access this module by an alternate name. In Injex, sharing an alias name between modules will create an injectable group as a map into your modules, as described in the [`@injectAlias()`](/docs/api/core/decorators/inject-alias) section.

## Usage

You add an alias name to a module by decorating its class with the `@alias(NAME,...)` decorator. Each module can have more than one alias name if you like, by providing a list of names as the decorator arguments.

```ts {4}
import { define, alias } from "@injex/core";

@define()
@alias("MailProvider")
export class GoogleMailProvider {

}
```