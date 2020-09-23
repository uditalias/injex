//@ts-nocheck
import { define, init, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Core", () => {

    it("should contain module", async () => {

        @define()
        @singleton()
        class MailService {
            public initialized: boolean;

            @init()
            public initialize() {
                this.initialized = true;
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailService }
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");
        const mailServiceDef = container.getModuleDefinition(MailService);

        expect(mailService.initialized).toBeTruthy();
        expect(mailService).toBeInstanceOf(MailService);

        expect(mailServiceDef.module).toBeInstanceOf(MailService);
        expect(mailServiceDef.metadata).toBeDefined();
        expect(mailServiceDef.metadata.singleton).toBe(true);
        expect(mailServiceDef.metadata.item).toBe(MailService);
    });
});