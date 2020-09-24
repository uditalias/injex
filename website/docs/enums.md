---
id: enums
title: Core Enums & Interfaces
sidebar_label: Core Enums & Interfaces
slug: /api/core/enums-interfaces
---

A list of TypeScript enums and interfaces you can use when working with the Injex framework and its Plugins.

## Enums

### LogLevel

#### Import

```typescript
import { LogLevel } from "@injex/core";
```

#### Values

```typescript
enum LogLevel {
    Error = 0,
    Warn = 1,
    Info = 2,
    Debug = 3
}
```

## Interfaces

### IInjexPlugin

```ts
export interface IInjexPlugin<T extends IContainerConfig = any> {
    apply(container: Injex<T>): void | Promise<void>;
}
```

### IMiddleware

```ts
export interface IMiddleware extends IConstructor {
    handle(req: Express.Request, res: Express.Response, next: NextFunction): void;
}
```