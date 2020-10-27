---
id: injectAlias
title: "Inject Alias Decorator"
sidebar_label: "@injectAlias"
slug: /api/core/decorators/inject-alias
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Property%20Decorator-orange?style=for-the-badge" />

When you add an [alias name](/docs/api/core/decorators/alias) for a module, you can inject all modules with the same alias name as a dependency map or set into another module.

## Usage

Use the `@injectAlias(NAME, KEY_BY?)` decorator to inject a dependency Map or Set into a module. The decorator accepts the alias name as the first argument, resulting in a set of modules defined with the alias name. 
If you pass the second `KEY_BY` optional argument, the result will be a key/value pair map of modules, indexed by the KEY_BY field on each one of them.

```ts {6-7,10,14}
import { define, singleton, injectAlias, AliasMap } from "@injex/core";

@define()
@singleton()
export default class MailService {
    @injectAlias("MailProvider", "TYPE") private allMailProviders: AliasMap<string, IMailProvider>;
    @injectAlias("Disposable") private disposables: IDisposable[];

    public sendMail(mail: Mail, providerType: string = "google") {
        this.allMailProviders[providerType].send(mail);
    }

    public destroy() {
        this.disposables.forEach(disposable => disposable.dispose());
    }
}
```

```ts {5,7} title="googleMailProvider.ts"
import { define, singleton, alias } from "@injex/core";

@define()
@singleton()
@alias("MailProvider", "Disposable")
export default class GoogleMailProvider implements IMailProvider, IDisposable {
    public readonly TYPE: string = "google";

    public send(mail: Mail) { ... }

    public dispose() { ... }
}
```

```ts {5,7} title="microsoftMailProvider.ts"
import { define, singleton, alias } from "@injex/core";

@define()
@singleton()
@alias("MailProvider", "Disposable")
export default class MicrosoftMailProvider implements IMailProvider, IDisposable {
    public readonly TYPE: string = "microsoft";

    public send(mail: Mail) { ... }

    public dispose() { ... }
}
```