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

    it("should run init for sync factory method", async () => {
        const fn = jest.fn();

        @define()
        class MailMessage {
            @init()
            public initialize() {
                fn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailMessage }
            ]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(0);

        const createMailMessage = container.get("mailMessage");
        const mailMessage = createMailMessage();

        expect(mailMessage).toBeDefined();
        expect(mailMessage).toBeInstanceOf(MailMessage);
    });

    it("should run init for async factory method", async () => {

        const fn = jest.fn();

        @define()
        class MailMessage {
            @init()
            public initialize() {
                fn();
                return Promise.resolve();
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailMessage }
            ]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(0);

        const createMailMessage = container.get("mailMessage");
        const mailMessage = createMailMessage();

        expect(mailMessage).toBeDefined();
        expect(mailMessage).toBeInstanceOf(Promise);

        const instance = await mailMessage;

        expect(instance).toBeInstanceOf(MailMessage);
    });
});