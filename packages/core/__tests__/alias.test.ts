//@ts-nocheck
import { alias, AliasFactory, AliasMap, define, init, injectAlias, singleton } from "../src";
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

    it("should inject alias set", async () => {

        const fn = jest.fn();

        interface IDisposable {
            dispose(): void;
        }

        @define()
        @singleton()
        @alias("Disposable")
        class GoogleMailProvider implements IDisposable {
            public dispose() {
                fn();
            }
        }

        @define()
        @singleton()
        @alias("Disposable")
        class MicrosoftMailProvider implements IDisposable {
            public dispose() {
                fn();
            }
        }

        @define()
        @singleton()
        class MailService {
            @injectAlias("Disposable") public disposables: IDisposable[];

            @init()
            protected initialize() {
                this.disposables.forEach((disposable) => disposable.dispose());
            }
        }

        const container = InjexMock.create({
            modules: [
                { GoogleMailProvider },
                { MicrosoftMailProvider },
                { MailService },
            ]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should inject a set and a map", async () => {

        interface IDisposable {
            dispose(): void;
        }

        @define()
        @singleton()
        @alias("MailProvider", "Disposable")
        class GoogleMailProvider implements IDisposable {
            public readonly Type = "Google";

            public dispose() { }
        }

        @define()
        @singleton()
        @alias("MailProvider", "Disposable")
        class MicrosoftMailProvider implements IDisposable {
            public readonly Type = "Microsoft";

            public dispose() { }
        }

        @define()
        @singleton()
        class MailService {

            @injectAlias("MailProvider", "Type") public mailProviders: AliasMap;
            @injectAlias("Disposable") public disposables: IDisposable[];

            @init()
            protected initialize() {
                this.disposables.forEach((disposable) => disposable.dispose());
            }
        }

        const container = InjexMock.create({
            modules: [
                { GoogleMailProvider },
                { MicrosoftMailProvider },
                { MailService },
            ]
        });

        await container.bootstrap();

        const disposables = container.getAlias("Disposable");
        const mailProviders = container.getAlias("MailProvider", "Type");
        const mailService = container.get("mailService");

        expect(disposables).toBeInstanceOf(Array);
        expect(disposables[0]).toBeInstanceOf(GoogleMailProvider);
        expect(disposables[1]).toBeInstanceOf(MicrosoftMailProvider);

        expect(mailService.disposables).toBeInstanceOf(Array);
        expect(mailService.disposables[0]).toBeInstanceOf(GoogleMailProvider);
        expect(mailService.disposables[1]).toBeInstanceOf(MicrosoftMailProvider);

        expect(mailProviders).toBeDefined();
        expect(mailProviders["Microsoft"]).toBeInstanceOf(MicrosoftMailProvider);
        expect(mailProviders["Google"]).toBeInstanceOf(GoogleMailProvider);

        expect(mailService.mailProviders).toBeDefined();
        expect(mailService.mailProviders["Microsoft"]).toBeInstanceOf(MicrosoftMailProvider);
        expect(mailService.mailProviders["Google"]).toBeInstanceOf(GoogleMailProvider);
    });

    it("should update alias factory map after adding alias module", async () => {

        interface IAnimal {
            makeVoice(): void;
        }

        @define()
        @alias("Animal")
        class Elephant implements IAnimal {
            public static readonly Name: string = "Elephant";
            public makeVoice() { }
        }

        @define()
        @alias("Animal")
        class Zebra implements IAnimal {
            public static readonly Name: string = "Zebra";
            public makeVoice() { }
        }

        @define()
        @singleton()
        class Zoo {
            @injectAlias("Animal", "Name") animals: AliasFactory<string, IAnimal>
        }

        const container = InjexMock.create({
            modules: [
                { Zoo },
                { Elephant },
            ]
        });

        await container.bootstrap();

        const zoo = container.get<Zoo>("zoo");

        expect(zoo).toBeDefined();
        expect(zoo).toBeInstanceOf(Zoo);
        expect(zoo.animals["Elephant"]).toBeDefined();
        expect(typeof zoo.animals["Elephant"]).toBe("function");
        expect(zoo.animals["Zebra"]).toBeUndefined();

        container.addModule(Zebra);

        expect(zoo.animals["Zebra"]).toBeDefined();
        expect(typeof zoo.animals["Zebra"]).toBe("function");
    });
});