//@ts-nocheck
import { define, injectFactory, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Inject Factory", () => {
    it("should inject factory instance as module dependency", async () => {

        @define()
        class MailMessage {
            public get text(): string {
                return "Hello, world!";
            }
        }

        @define()
        @singleton()
        class MailSender {
            @injectFactory(MailMessage) public message: MailMessage;
        }

        const container = InjexMock.create({
            modules: [
                { MailSender },
                { MailMessage },
            ]
        });

        await container.bootstrap();

        const mailSender = container.get<MailSender>("mailSender");

        expect(mailSender.message).toBeDefined();
        expect(mailSender.message).toBeInstanceOf(MailMessage);
        expect(mailSender.message.text).toEqual("Hello, world!");
    });

    it("should throw error when factory module not exists", async () => {

        class MailMessage { }

        @define()
        @singleton()
        class MailSender {
            @injectFactory(MailMessage) public message: MailMessage;
        }

        const container = InjexMock.create({
            modules: [
                { MailSender },
            ]
        });

        expect(container.bootstrap()).rejects.toThrow("MailMessage is not a factory module.");
    });
});