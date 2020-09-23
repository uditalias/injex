//@ts-nocheck
import { define, init, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Singleton", () => {

    it("should define module as singleton", async () => {
        @define()
        @singleton()
        class MailService {
        }

        const container = InjexMock.create({
            modules: [
                { MailService }
            ]
        });

        await container.bootstrap();

        const mailService = container.get("mailService");
        const mailService2 = container.get("mailService");

        expect(mailService).toBeDefined();
        expect(mailService2).toBeDefined();
        expect(mailService).toBe(mailService2);
    });

    it("should define module as factory", async () => {
        @define()
        class Mail {
        }

        const container = InjexMock.create({
            modules: [
                { Mail }
            ]
        });

        await container.bootstrap();

        const createMailFactory = container.get("mail");

        const mail = await createMailFactory();
        const mail2 = await createMailFactory();

        expect(mail).toBeDefined();
        expect(mail2).toBeDefined();
        expect(mail).toBeInstanceOf(Mail);
        expect(mail2).toBeInstanceOf(Mail);
        expect(mail === mail2).toBeFalsy();
    });
});