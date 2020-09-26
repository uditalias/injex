---
id: enums
title: Core Enums & Interfaces
sidebar_label: Core Enums & Interfaces
slug: /api/core/enums-interfaces
---

A list of TypeScript enums and interfaces you can use when working with the Injex framework and its Plugins.
This page is used as the appendix for some pages in these docs.

## Enums

### LogLevel

```typescript
import { LogLevel } from "@injex/core";

enum LogLevel {
    Error = 0,
    Warn = 1,
    Info = 2,
    Debug = 3
}
```

## Interfaces

### IBootstrap

```ts
import { IBootstrap } from "@injex/core";

export interface IBootstrap {
    run(): Promise<void> | void;
    didCatch?(e: Error): void;
}
```

### ILazyModule
```ts
import { ILazyModule } from "@injex/core";

export interface ILazyModule<T> {
    import(...args: any[]): Promise<IConstructor<T>>;
}
```

### IInjexPlugin

```ts
import { IInjexPlugin } from "@injex/core";

export interface IInjexPlugin<T extends IContainerConfig = any> {
    apply(container: Injex<T>): void | Promise<void>;
}
```

### IMiddleware

```ts
import { IMiddleware } from "@injex/express-plugin";

export interface IMiddleware extends IConstructor {
    handle(req: Express.Request, res: Express.Response, next: NextFunction): void;
}
```