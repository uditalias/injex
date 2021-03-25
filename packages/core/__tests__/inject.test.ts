//@ts-nocheck
import { define, inject, singleton } from "../src";
import { Factory } from "../src/interfaces";
import InjexMock from "./__mocks__/InjexMock";

describe("Inject", () => {

    it("should inject module dependency", async () => {
        @define()
        @singleton()
        class MailService {
        }

        @define()
        @singleton()
        class MailSender {
            @inject() public mailService: MailService;
        }

        const container = InjexMock.create({
            modules: [
                { MailService },
                { MailSender },
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");
        const mailSender = container.get<MailSender>("mailSender");

        expect(mailSender).toBeDefined();
        expect(mailService).toBeDefined();
        expect(mailSender.mailService).toBeInstanceOf(MailService);
        expect(mailSender.mailService).toBe(mailService);
    });

    it("should inject module dependency by type", async () => {
        @define()
        @singleton()
        class MailService {
        }

        @define()
        @singleton()
        class MailSender {
            @inject(MailService) public service: MailService;
        }

        const container = InjexMock.create({
            modules: [
                { MailService },
                { MailSender },
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");
        const mailSender = container.get<MailSender>("mailSender");

        expect(mailSender).toBeDefined();
        expect(mailService).toBeDefined();
        expect(mailSender.service).toBeInstanceOf(MailService);
        expect(mailSender.service).toBe(mailService);
    });

    it("should inject module dependency by name", async () => {
        @define()
        @singleton()
        class MailService {
        }

        @define()
        @singleton()
        class MailSender {
            @inject("mailService") public service: MailService;
        }

        const container = InjexMock.create({
            modules: [
                { MailService },
                { MailSender },
            ]
        });

        await container.bootstrap();

        const mailService = container.get<MailService>("mailService");
        const mailSender = container.get<MailSender>("mailSender");

        expect(mailSender).toBeDefined();
        expect(mailService).toBeDefined();
        expect(mailSender.service).toBeInstanceOf(MailService);
        expect(mailSender.service).toBe(mailService);
    });

    it("should inject dependency in abstract parent", async () => {

        @define()
        @singleton()
        class Zoo {

        }

        abstract class Animal {
            @inject() public zoo: Zoo;
        }

        @define()
        class Lion extends Animal {

        }

        const container = InjexMock.create({
            modules: [
                { Zoo, Lion },
            ]
        });

        await container.bootstrap();

        const lion = container.get<Factory<Lion>>("lion")();

        expect(lion).toBeInstanceOf(Lion);
        expect(lion.zoo).toBeDefined();
        expect(lion.zoo).toBeInstanceOf(Zoo);
    });

    it("should inject lazy module as a singleton dependency", async () => {

        @define()
        @singleton()
        class Clock {
            public getTime(): number {
                return Date.now();
            }
        }

        @define()
        @singleton()
        class Certificate {
            @inject() public clock: Clock;

            public get value(): string {
                return "--CERTIFICATE--";
            }
        }

        @define()
        @singleton()
        class Student {
            @inject() public certificate: Certificate;
        }

        const container = InjexMock.create({
            modules: [
                { Clock },
                { Student },
            ]
        });

        await container.bootstrap();

        const student = container.get<Student>("student");

        expect(student).toBeDefined();
        expect(student).toBeInstanceOf(Student);
        expect(student.certificate).toBeNull();

        container.addModule(Certificate);

        expect(student.certificate).toBeInstanceOf(Certificate);
        expect(student.certificate.value).toEqual("--CERTIFICATE--");

        const certificate = container.get<Certificate>("certificate");

        expect(certificate).toBeDefined();
        expect(certificate).toBeInstanceOf(Certificate);
        expect(certificate.value).toEqual("--CERTIFICATE--");

        expect(typeof certificate.clock.getTime()).toBe("number");
    });
});