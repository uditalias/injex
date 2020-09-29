//@ts-nocheck
import { define, singleton, bootstrap } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Hooks", () => {
    it("should trigger beforeRegistration hook", async () => {

        const fn = jest.fn();

        await InjexMock.create({
            modules: [],
            plugins: [{
                apply(container) {
                    container.hooks.beforeRegistration.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);
    });

    it("should trigger afterRegistration hook", async () => {

        const fn = jest.fn();

        await InjexMock.create({
            modules: [],
            plugins: [{
                apply(container) {
                    container.hooks.afterRegistration.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);
    });

    it("should trigger beforeCreateModules hook", async () => {

        const fn = jest.fn();

        await InjexMock.create({
            modules: [],
            plugins: [{
                apply(container) {
                    container.hooks.beforeCreateModules.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);
    });

    it("should trigger afterModuleCreation hook", async () => {

        const fn = jest.fn();

        @define()
        class Module1 { }

        @define()
        class Module2 { }

        const container = await InjexMock.create({
            modules: [
                { Module1 }, { Module2 }
            ],
            plugins: [{
                apply(container) {
                    container.hooks.afterModuleCreation.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(2);
        expect(fn).toHaveBeenNthCalledWith(1, container.getModuleDefinition(Module1));
        expect(fn).toHaveBeenNthCalledWith(2, container.getModuleDefinition(Module2));
    });

    it("should trigger afterCreateModules hook", async () => {

        const fn = jest.fn();

        @define()
        class Module1 { }

        @define()
        class Module2 { }

        await InjexMock.create({
            modules: [
                { Module1 }, { Module2 }
            ],
            plugins: [{
                apply(container) {
                    container.hooks.afterCreateModules.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);
    });

    it("should trigger beforeCreateInstance hook", async () => {

        const fn = jest.fn();

        @define()
        @singleton()
        class Module1 { }

        @define()
        class Module2 { }

        const container = await InjexMock.create({
            modules: [
                { Module1 }, { Module2 }
            ],
            plugins: [{
                apply(container) {
                    container.hooks.beforeCreateInstance.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);

        const { module: module2Factory } = container.getModuleDefinition(Module2);
        const module2 = await module2Factory();

        expect(module2).toBeInstanceOf(Module2);
        expect(fn).toBeCalledTimes(2);
    });

    it("should trigger bootstrapRun hook", async () => {

        const fn = jest.fn();

        @bootstrap()
        class Bootstrap {
            public run() { }
        }

        await InjexMock.create({
            modules: [
                { Bootstrap }
            ],
            plugins: [{
                apply(container) {
                    container.hooks.bootstrapRun.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);
    });

    it("should trigger bootstrapComplete hook", async () => {

        const fn = jest.fn();

        @bootstrap()
        class Bootstrap {
            public run() { }
        }

        await InjexMock.create({
            modules: [
                { Bootstrap }
            ],
            plugins: [{
                apply(container) {
                    container.hooks.bootstrapComplete.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);
    });

    it("should trigger bootstrapError hook", async () => {

        const fn = jest.fn();

        class BootstrapError extends Error { }
        const err = new BootstrapError();

        @bootstrap()
        class Bootstrap {
            public run() {
                throw err;
            }

            public didCatch() { }
        }

        await InjexMock.create({
            modules: [
                { Bootstrap }
            ],
            plugins: [{
                apply(container) {
                    container.hooks.bootstrapError.tap(fn);
                }
            }]
        }).bootstrap();

        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith(err);
    });
});