---
id: injectFactory
title: "Inject Factory Decorator"
sidebar_label: "@injectFactory"
slug: /api/core/decorators/inject-factory
---

<img className="decorator-badge" src="https://img.shields.io/badge/Type-Property%20Decorator-orange?style=for-the-badge" />

Inject factory will create and inject a module instance using its factory method.

A factory method is created whenever you create a non-singleton module using only the `@define()` decorator.

When you `@inject()` a non-singleton module as a dependency, Injex will inject the factory method so you can create multiple instances of it whenever you need them. Sometimes, you just want to directly inject an instance of this module. Using `@injectFactory()` will resolve these cases.

## Usage

Use the `@injectFactory()` decorator to inject a module instance using its factory method.

```ts {11,14,18}
@define()
class SteeringWheel {
    public rotate(degree: number) {
        ...
    }
}

@define()
@singleton()
class PlayerCar {
    @injectFactory() public steeringWheel: SteeringWheel;

    public turnLeft() {
        this.steeringWheel.rotate(-90);
    }

    public turnRight() {
        this.steeringWheel.rotate(90);
    }
}
```

In this example, the `PlayerCar` class has the `steeringWheel` member which resolves to a `SteeringWheel` instance. If we replace the `@injectFactory()` decorator with the regular `@inject()`, we get the `SteeringWheel` factory method.