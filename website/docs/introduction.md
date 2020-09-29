---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /introduction
---

## Prologue

Creating software can be challenging, but it does not have to be. When it comes to project scalability and maintainability, it's essential to keep a project's files, modules, and dependencies nice and tidy so you can add features, fix bugs, and refactor code more efficiently.

TypeScript is designed for development of large applications and brings the benefits of strict and static types over JavaScript, so today, it's easy to refactor large codebase applications without the fear of breaking things on runtime.

But still, when you need to organize your codebase, keep it abstract and implement the SOLID principles, you need something to manage modules, instances, factories, and abstraction.

<img src="/img/poster.png" style={{borderRadius: "var(--ifm-alert-border-radius)" }} />

## Dependency Injection Framework

**Injex** is a dependency injection framework that helps you resolve dependencies automatically. Think about a large application codebase with hundreds of modules; how can we manage all these connections and dependencies?

The Injex framework was created with simplicity in mind and in an unopinionated way so you can keep writing your classes with a small footprint. Injex API is small, so you don't need to learn new concepts.

Injex's core API works the same both on the server and the client, so it's easy to share code between them.

## Why should I use Injex?

1. You love and write TypeScript applications.
2. You like to write clean code.
3. You want to implement the SOLID principles.
4. You're a full-stack developer who wants to build server/client applications.
5. You don't want to make your hands dirty from circular dependencies.
6. You want to be able to refactor code more efficiently.
7. You like to keep your code abstract as possible.
8. You want something to manage module dependencies for you.

## What is dependency injection?

>In software engineering, dependency injection is a technique whereby one object supplies the dependencies of another object. A "dependency" is an object that can be used, for example, as a service. Instead of a client specifying which service it will use, something tells the client what service to use. The "injection" refers to the passing of a dependency (a service) into the object (a client) that would use it.

From [Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)

:::note
Currently, the Injex framework works only with TypeScript.
:::