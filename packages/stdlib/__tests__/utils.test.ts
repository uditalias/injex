import { toCamelCase, isFunction, getConstructorName } from "../src/utils";

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

    describe("getConstructorName", () => {
        it("should return class constructor name", () => {
            class Container { }

            expect(getConstructorName(new Container)).toBe("Container");
        });
    });
});