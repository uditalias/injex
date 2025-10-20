import { alias, define, injectAlias, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Inject Alias", () => {
    it("should inject all modules with the same alias", async () => {
        interface IMailProvider {
            send(message: string): string;
        }

        @define()
        @singleton()
        @alias("IMailProvider")
        class SmtpProvider implements IMailProvider {
            public send(message: string): string {
                return `SMTP: ${message}`;
            }
        }

        @define()
        @singleton()
        @alias("IMailProvider")
        class SendGridProvider implements IMailProvider {
            public send(message: string): string {
                return `SendGrid: ${message}`;
            }
        }

        @define()
        @singleton()
        class MailService {
            @injectAlias("IMailProvider")
            public providers: any;
        }

        const container = InjexMock.create({
            modules: [
                { SmtpProvider },
                { SendGridProvider },
                { MailService },
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");

        expect(mailService.providers).toBeDefined();
        expect(mailService.providers.size).toBe(2);
    });

    it("should inject aliased modules with keyBy", async () => {
        interface IMailProvider {
            type: string;
            send(message: string): string;
        }

        @define()
        @singleton()
        @alias("IMailProvider")
        class SmtpProvider implements IMailProvider {
            public type = "smtp";
            public send(message: string): string {
                return `SMTP: ${message}`;
            }
        }

        @define()
        @singleton()
        @alias("IMailProvider")
        class SendGridProvider implements IMailProvider {
            public type = "sendgrid";
            public send(message: string): string {
                return `SendGrid: ${message}`;
            }
        }

        @define()
        @singleton()
        class MailService {
            @injectAlias("IMailProvider", "type")
            public providers: any;
        }

        const container = InjexMock.create({
            modules: [
                { SmtpProvider },
                { SendGridProvider },
                { MailService },
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");

        expect(mailService.providers).toBeDefined();
        expect(mailService.providers.get("smtp")).toBeInstanceOf(SmtpProvider);
        expect(mailService.providers.get("sendgrid")).toBeInstanceOf(SendGridProvider);
    });

    it("should inject empty alias map when no modules match", async () => {
        @define()
        @singleton()
        class MailService {
            @injectAlias("NonExistentAlias")
            public providers: any;
        }

        const container = InjexMock.create({
            modules: [
                { MailService },
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");

        expect(mailService.providers).toBeDefined();
        expect(mailService.providers.size).toBe(0);
    });

    it("should inject aliased modules in parent class", async () => {
        interface IPlugin {
            name: string;
        }

        @define()
        @singleton()
        @alias("IPlugin")
        class Plugin1 implements IPlugin {
            public name = "plugin1";
        }

        @define()
        @singleton()
        @alias("IPlugin")
        class Plugin2 implements IPlugin {
            public name = "plugin2";
        }

        abstract class BaseService {
            @injectAlias("IPlugin", "name")
            protected plugins: any;
        }

        @define()
        @singleton()
        class PluginManager extends BaseService {
            public getPlugin(name: string) {
                return this.plugins.get(name);
            }
        }

        const container = InjexMock.create({
            modules: [
                { Plugin1 },
                { Plugin2 },
                { PluginManager },
            ]
        });

        await container.bootstrap();

        const manager = container.get<PluginManager>("pluginManager");

        expect(manager.getPlugin("plugin1")).toBeInstanceOf(Plugin1);
        expect(manager.getPlugin("plugin2")).toBeInstanceOf(Plugin2);
    });

    it("should support multiple aliases on same module", async () => {
        @define()
        @singleton()
        @alias("IService", "IProvider", "IHandler")
        class MultiAliasService {
            public value = "test";
        }

        @define()
        @singleton()
        class Consumer {
            @injectAlias("IService")
            public services: any;

            @injectAlias("IProvider")
            public providers: any;

            @injectAlias("IHandler")
            public handlers: any;
        }

        const container = InjexMock.create({
            modules: [
                { MultiAliasService },
                { Consumer },
            ]
        });

        await container.bootstrap();

        const consumer = container.get<Consumer>("consumer");

        expect(consumer.services.size).toBe(1);
        expect(consumer.providers.size).toBe(1);
        expect(consumer.handlers.size).toBe(1);
    });

    it("should iterate over injected alias map", async () => {
        @define()
        @singleton()
        @alias("ICounter")
        class Counter1 {
            public count = 1;
        }

        @define()
        @singleton()
        @alias("ICounter")
        class Counter2 {
            public count = 2;
        }

        @define()
        @singleton()
        class CounterService {
            @injectAlias("ICounter")
            public counters: any;

            public getTotalCount(): number {
                let total = 0;
                this.counters.forEach((counter: any) => {
                    total += counter.count;
                });
                return total;
            }
        }

        const container = InjexMock.create({
            modules: [
                { Counter1 },
                { Counter2 },
                { CounterService },
            ]
        });

        await container.bootstrap();

        const service = container.get<CounterService>("counterService");

        expect(service.getTotalCount()).toBe(3);
    });
});
