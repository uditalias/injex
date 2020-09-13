//@ts-nocheck
import { alias, AliasMap, define, init, injectAlias, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Alias", () => {

    it("should define module alias", async () => {
        @define()
        @singleton()
        @alias("IMailService")
        class MailService {
        }

        const container = InjexMock.create({
            modules: [
                { MailService },
            ]
        });

        await container.bootstrap();

        const mailServiceDef = container.getModuleDefinition(MailService);

        expect(mailServiceDef.metadata.aliases).toContain("IMailService");
    });

    it("should inject alias map", async () => {
        @define()
        @singleton()
        @alias("IMailProvider")
        class GoogleMailProvider {
            public readonly Type = "Google";
        }

        @define()
        @singleton()
        @alias("IMailProvider")
        class MicrosoftMailProvider {
            public readonly Type = "Microsoft";
        }

        @define()
        @singleton()
        class MailService {
            @injectAlias("IMailProvider", "Type") public providers: AliasMap;
        }

        const container = InjexMock.create({
            modules: [
                { GoogleMailProvider },
                { MicrosoftMailProvider },
                { MailService },
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");

        expect(mailService.providers["Google"]).toBeInstanceOf(GoogleMailProvider);
        expect(mailService.providers["Microsoft"]).toBeInstanceOf(MicrosoftMailProvider);
    });
});