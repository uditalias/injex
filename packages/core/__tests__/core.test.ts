//@ts-nocheck
import { alias, define, init, inject, singleton } from "../src";
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

        const containerRef = container.get("$injex");
        const mailService = container.get<MailService>("mailService");
        const mailServiceDef = container.getModuleDefinition(MailService);

        expect(mailService.initialized).toBeTruthy();
        expect(mailService).toBeInstanceOf(MailService);

        expect(mailServiceDef.module).toBeInstanceOf(MailService);
        expect(mailServiceDef.metadata).toBeDefined();
        expect(mailServiceDef.metadata.singleton).toBe(true);
        expect(mailServiceDef.metadata.item).toBe(MailService);

        expect(containerRef).toBeDefined();
        expect(containerRef).toBeInstanceOf(InjexMock);
        expect(containerRef).toEqual(container);
    });

    it("should get module", async () => {
        @define()
        @singleton()
        class MailService { }

        const container = InjexMock.create({
            modules: [
                { MailService }
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");

        expect(mailService).toBeDefined();
        expect(mailService).toBeInstanceOf(MailService);
    });

    it("should get multiple modules", async () => {
        @define()
        @singleton()
        class MailService {
        }

        @define()
        @singleton()
        class ReportService {
        }

        const container = InjexMock.create({
            modules: [
                { MailService, ReportService }
            ]
        });

        await container.bootstrap();

        const [mailService, reportService] = container.get<MailService, ReportService>('mailService', 'reportService');

        expect(mailService).toBeDefined();
        expect(mailService).toBeInstanceOf(MailService);

        expect(reportService).toBeDefined();
        expect(reportService).toBeInstanceOf(ReportService);
    });

    it("should get alias map", async () => {

        interface IAnimal {
            name: string;
        }

        @define()
        @singleton()
        @alias("Animal")
        class Dog implements IAnimal {
            public readonly name = "dog";
        }

        @define()
        @singleton()
        @alias("Animal")
        class Cat implements IAnimal {
            public readonly name = "cat";
        }

        const container = InjexMock.create({
            modules: [
                { Dog }, { Cat }
            ]
        });

        await container.bootstrap();

        const animals = container.getAlias<string, IAnimal>("Animal", "name");

        expect(animals).toBeDefined();
        expect(animals.dog).toBeDefined();
        expect(animals.cat).toBeDefined();
        expect(animals.zebra).toBeUndefined();

        expect(animals.dog).toBeInstanceOf(Dog);
        expect(animals.cat).toBeInstanceOf(Cat);
    });

    it("should extend injectable module with abstract module", async () => {

        const fn = jest.fn();

        @define()
        @singleton()
        class Module {
            public start() { }
        }

        abstract class Parent {
            @inject() protected module: Module;
        }

        @define()
        @singleton()
        class Child extends Parent {
            @init()
            protected initialize() {
                fn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { Module }, { Parent }, { Child }
            ]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should throw error if bootstrap called more than once", async () => {
        const container = InjexMock.create({
            modules: []
        });

        await container.bootstrap();


        await expect(container.bootstrap()).rejects.toThrowError(
            'Bootstrap failed: container bootstrap should run only once.'
        )
    });

    it("should create injex container using `perfMode`", async () => {

        let mailServiceInitTime: number;
        let analyticsServiceInitTime: number;
        @define()
        @singleton()
        class MailService {
            constructor() {
                mailServiceInitTime = Date.now();
            }
        }

        @define()
        @singleton()
        class AnalyticsService {
            constructor() {
                analyticsServiceInitTime = Date.now();
            }
        }

        const container = InjexMock.create({
            modules: [{ MailService }, { AnalyticsService }],
            perfMode: true
        });

        await container.bootstrap();

        const [mailService, analyticsService] = container.get<MailService, AnalyticsService>('mailService', 'analyticsService');

        expect(mailService).toBeInstanceOf(MailService);
        expect(analyticsService).toBeInstanceOf(AnalyticsService);
        expect(analyticsServiceInitTime - mailServiceInitTime).toBeGreaterThan(0);
    });
});