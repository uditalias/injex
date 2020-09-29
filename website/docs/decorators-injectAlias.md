---
id: injectAlias
title: "Inject Alias Decorator"
sidebar_label: "@injectAlias"
slug: /api/core/decorators/inject-alias
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Property%20Decorator-orange?style=for-the-badge" />

When you add an [alias name](/docs/api/core/decorators/alias) for a module, you can inject all modules with the same alias name as a dependency map into another module.

## Usage

Use the `@injectAlias(NAME, KEY_BY)` decorator to inject a dependency map into a module. The decorator accepts two required arguments. The first one is the alias name to inject; the second is the map key field on each module.

```ts {6,9}
import { define, singleton, injectAlias, AliasMap } from "@injex/core";

@define()
@singleton()
export default class MailService {
    @injectAlias("MailProvider", "TYPE") private allMailProviders: AliasMap<string, IMailProvider>;

    public sendMail(mail: Mail, providerType: string = "google") {
        this.allMailProviders[providerType].send(mail);
    }
}
```

```ts {5,7} title="googleMailProvider.ts"
import { define, singleton, alias } from "@injex/core";

@define()
@singleton()
@alias("MailProvider")
export default class GoogleMailProvider implements IMailProvider {
    public readonly TYPE: string = "google";

    public send(mail: Mail) { ... }
}
```

```ts {5,7} title="microsoftMailProvider.ts"
import { define, singleton, alias } from "@injex/core";

@define()
@singleton()
@alias("MailProvider")
export default class MicrosoftMailProvider implements IMailProvider {
    public readonly TYPE: string = "microsoft";

    public send(mail: Mail) { ... }
}
```