//@ts-nocheck
import { define, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Define", () => {

    it("should define module", async () => {
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

        const service = container.get("mailService");

        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(MailService);
    });

    it("should define module with custom name", async () => {
        @define("myService")
        @singleton()
        class MailService {
        }

        const container = InjexMock.create({
            modules: [
                { MailService }
            ]
        });

        await container.bootstrap();

        const service = container.get("myService");

        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(MailService);
    });

    it("should throw error when module already defined", async () => {
        @define("myService")
        @singleton()
        class MailService {
        }

        @define("myService")
        @singleton()
        class MailService2 {
        }

        const container = InjexMock.create({
            modules: [
                { MailService },
                { MailService2 }
            ]
        });

        expect(container.bootstrap()).rejects.toThrow("Module 'myService' already defined.");
    });
});