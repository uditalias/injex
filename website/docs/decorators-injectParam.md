---
id: injectParam
title: "Inject Param Decorator"
sidebar_label: "@injectParam"
slug: /api/core/decorators/inject-param
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Param%20Decorator-green?style=for-the-badge" />

With inject param decorator you inject a dependency into a class method as a parameter instead of as a class property.

## Usage

Use the `@injectParam()` decorator to decorate a method parameter.

```ts {10}
import { define, singleton, injectParam } from "@injex/core";

@define()
@singleton()
export class SomeService { ... }

@define()
@singleton()
export class SomeServiceProvider {
    public getService(@injectParam() someService: SomeService) { 
        return someService;
    }
}
```

Note that you can use the `@injectParam()` decorator in 3 ways just like the `@inject()` decorator:

- Using auto-discovery dependency name:
    ```typescript
    @injectParam() someService: SomeService
    ```
- Using different name while providing the dependency name:
    ```typescript
    @injectParam('someService') service: SomeService
    ```
- Using different name while providing the dependency type:
    ```typescript
    @injectParam(SomeService) service: SomeService
    ```

## Caveats

 - Since the auto-discovery dependency name relies on the parameter name, this feature may not work when using code minifiers.
If this is the case, you can choose one of the other options to decorate a method parameter.
- `@injectParam()` decorators should be use to decorate the last parameters in the parameters list of a class method.<br/><br/>For example:
    ```typescript
    class SomeServiceProvider {
        public someMethod(p1: number, p2: string, @injectParam() s1, @injectParam() s2) {
            ...
        }
    }
    ```