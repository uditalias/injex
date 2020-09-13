//@ts-nocheck
import { define, init, singleton, bootstrap, IBootstrap } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Bootstrap", () => {

    it("should run bootstrap", async () => {
        const fn = jest.fn();

        @bootstrap()
        class Bootstrap implements IBootstrap {
            public run() {
                fn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { Bootstrap }
            ]
        });

        await container.bootstrap();

        expect(fn).toBeCalledTimes(1);
    });

    it("should trigger didCatch method on bootstrap error", async () => {
        const runFn = jest.fn();
        const catchFn = jest.fn();

        class MailServiceError extends Error { }

        @define()
        @singleton()
        class MailService {
            @init()
            public initialize() {
                throw new MailServiceError();
            }
        }

        @bootstrap()
        class Bootstrap implements IBootstrap {
            public run() {
                runFn()
            }
            public didCatch(e) {
                catchFn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { Bootstrap },
                { MailService },
            ]
        });

        await container.bootstrap();

        expect(catchFn).toBeCalledTimes(1);
        expect(runFn).toBeCalledTimes(0);
    })
});