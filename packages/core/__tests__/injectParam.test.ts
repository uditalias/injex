//@ts-nocheck
import { define, init, injectParam, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Inject Param", () => {
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
            public send(message: string, @injectParam() mailService: MailService) {
                return mailService.send(message);
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
            public send(@injectParam() mailService: MailService, @injectParam() dummyCacheService: DummyCacheService) {
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
            public getServiceByType(@injectParam(SomeService) service: SomeService) {
                return service;
            }

            public getServiceByName(@injectParam("someService") service: SomeService) {
                return service;
            }

            public getServiceByDiscovery(@injectParam() someService: SomeService) {
                return someService;
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

    it("should keep method scope when using inject param", async () => {
        @define()
        @singleton()
        class SomeService { }

        @define()
        @singleton()
        class ServiceProvider {
            public echoInstance(@injectParam(SomeService) service: SomeService) {
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
});