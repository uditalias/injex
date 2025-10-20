import { define, injectParams, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Inject Params (TC39)", () => {
    it("should inject param into module method", async () => {

        @define()
        @singleton()
        class MailService {
            public send(message: string) {
                return message;
            }
        }

        @define()
        @singleton()
        class MailSender {
            @injectParams([{ index: 1, value: MailService }])
            public send(message: string, mailService?: MailService) {
                return mailService!.send(message);
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailSender },
                { MailService },
            ]
        });

        await container.bootstrap();

        const mailSender = container.get<MailSender>("mailSender");

        const response = mailSender.send("Hello, World!");

        expect(response).toBe("Hello, World!");
    });

    it("should inject more than 1 param into method", async () => {
        @define()
        @singleton()
        class MailService {
            public send(message: string) {
                return message;
            }
        }

        @define()
        @singleton()
        class DummyCacheService {
            private _values: Map<string, any> = new Map();

            public set(key: string, value: any) {
                this._values.set(key, value);
            }

            public get(key: string): any {
                return this._values.get(key);
            }
        }

        @define()
        @singleton()
        class MailSender {
            @injectParams([
                { index: 0, value: MailService },
                { index: 1, value: DummyCacheService }
            ])
            public send(mailService?: MailService, dummyCacheService?: DummyCacheService) {
                return [
                    mailService,
                    dummyCacheService
                ];
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailSender },
                { MailService },
                { DummyCacheService },
            ]
        });

        await container.bootstrap();

        const mailSender = container.get<MailSender>("mailSender");

        const [mailService, dummyCacheService] = mailSender.send();

        expect(mailService).toBeInstanceOf(MailService);
        expect(dummyCacheService).toBeInstanceOf(DummyCacheService);
    });

    it("should inject param by name and type", async () => {
        @define()
        @singleton()
        class SomeService { }

        @define()
        @singleton()
        class ServiceProvider {
            @injectParams([{ index: 0, value: SomeService }])
            public getServiceByType(service?: SomeService) {
                return service!;
            }

            @injectParams([{ index: 0, value: "someService" }])
            public getServiceByName(service?: SomeService) {
                return service!;
            }

            @injectParams([{ index: 0, value: "someService" }])
            public getServiceByDiscovery(someService?: SomeService) {
                return someService!;
            }
        }

        const container = InjexMock.create({
            modules: [
                { SomeService },
                { ServiceProvider },
            ]
        });

        await container.bootstrap();

        const serviceProvider = container.get<ServiceProvider>("serviceProvider");

        expect(serviceProvider.getServiceByType()).toBeDefined();
        expect(serviceProvider.getServiceByType()).toBeInstanceOf(SomeService);

        expect(serviceProvider.getServiceByName()).toBeDefined();
        expect(serviceProvider.getServiceByName()).toBeInstanceOf(SomeService);

        expect(serviceProvider.getServiceByDiscovery()).toBeDefined();
        expect(serviceProvider.getServiceByDiscovery()).toBeInstanceOf(SomeService);
    });

    it("should keep method scope when using inject params", async () => {
        @define()
        @singleton()
        class SomeService { }

        @define()
        @singleton()
        class ServiceProvider {
            @injectParams([{ index: 0, value: SomeService }])
            public echoInstance(service?: SomeService) {
                return this;
            }
        }

        const container = InjexMock.create({
            modules: [
                { SomeService },
                { ServiceProvider },
            ]
        });

        await container.bootstrap();

        const serviceProvider = container.get<ServiceProvider>("serviceProvider");

        expect(serviceProvider.echoInstance()).toBeInstanceOf(ServiceProvider);
        expect(serviceProvider.echoInstance()).toStrictEqual(serviceProvider);
    });

    it("should inject params with mixed user args and injected args", async () => {
        @define()
        @singleton()
        class MailService {
            public send(message: string) {
                return `Sent: ${message}`;
            }
        }

        @define()
        @singleton()
        class MailSender {
            @injectParams([{ index: 1, value: MailService }])
            public sendWithPrefix(prefix: string, mailService?: MailService) {
                return mailService!.send(`${prefix} - message`);
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailSender },
                { MailService },
            ]
        });

        await container.bootstrap();

        const mailSender = container.get<MailSender>("mailSender");

        const response = mailSender.sendWithPrefix("Important");

        expect(response).toBe("Sent: Important - message");
    });
});
