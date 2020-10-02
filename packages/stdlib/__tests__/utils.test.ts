import { toCamelCase, isFunction, isPromise, getConstructorName } from "../src/utils";

describe("Utils", () => {

    describe("toCamelCase", () => {
        it("should convert string to camel case", () => {
            expect(toCamelCase("MyClass")).toBe("myClass");
            expect(toCamelCase("Hello World")).toBe("hello World");
            expect(toCamelCase("myService")).toBe("myService");
        });
    });

    describe("isFunction", () => {
        it("should return true if function is passed", () => {
            expect(isFunction(() => { })).toBe(true);
            expect(isFunction(function () { })).toBe(true);
        });

        it("should return false if value is not a function", () => {
            expect(isFunction(false)).toBe(false);
            expect(isFunction("string")).toBe(false);
            expect(isFunction(42)).toBe(false);
        });
    });

    describe("isPromise", () => {
        it("should return true if object is promise", () => {
            const promise = new Promise(() => { });
            expect(isPromise(promise)).toBe(true);
            expect(isPromise(Promise.resolve())).toBe(true);
            expect(isPromise({ then: () => { }, catch: () => { } })).toBe(true);
        });

        it("should return false if object is not a promise", () => {
            expect(isPromise({})).toBe(false);
            expect(isPromise(null)).toBe(false);
            expect(isPromise(undefined)).toBe(false);
            expect(isPromise({ then: () => { } })).toBe(false);
            expect(isPromise({ catch: () => { } })).toBe(false);
        });
    });

    describe("getConstructorName", () => {
        it("should return class constructor name", () => {
            class Container { }

            expect(getConstructorName(new Container)).toBe("Container");
        });
    });
});