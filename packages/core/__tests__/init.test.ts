//@ts-nocheck
import { define, init, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Init", () => {

    it("should run init method", async () => {
        const fn = jest.fn();

        @define()
        @singleton()
        class MailService {
            @init()
            public initialize() {
                fn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailService }
            ]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(1);
    });
});