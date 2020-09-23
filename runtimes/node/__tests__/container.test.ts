import { LogLevel, errors } from "@injex/core";
import { RootDirectoryNotExistError } from "../src/errors";
import * as path from "path";
import { MailManager } from "./__mocks__/general/mailManager";
import { MailService } from "./__mocks__/general/mailService";
import { Mail } from "./__mocks__/general/mail";
import { Injex } from "../src";

describe("InjexNodeContainer", () => {

    function createContainer() {
        const container = Injex.create({
            rootDirs: [
                path.resolve(__dirname, "__mocks__/general")
            ],
            globPattern: "/**/*.ts",
            logLevel: LogLevel.Error,
            plugins: []
        });

        return container.bootstrap();
    }

    it("should create container", async () => {
        const container = await createContainer();

        expect(container).toBeDefined();
        expect(container).toBeInstanceOf(Injex);
    });

    it("should get object", async () => {
        const container = await createContainer();

        const mailManager = container.get<MailManager>("mailManager");
        const mailService = container.get<MailService>("mailService");

        expect(mailManager).toBeDefined();
        expect(mailService).toBeDefined();
        expect(mailManager).toBeInstanceOf(MailManager);
        expect(mailService).toBeInstanceOf(MailService);
    });

    it("should inject and use dependency", async () => {
        const container = await createContainer();

        const mailManager = container.get<MailManager>("mailManager");
        const mailService = container.get<MailService>("mailService");

        const mailServiceSend = spyOn(mailService, "send");
        const mailFactory = spyOn(mailManager, "createMail" as any);

        mailManager.send("Hello World!");

        expect(mailServiceSend).toHaveBeenCalled();
        expect(mailServiceSend).toHaveBeenCalledTimes(1);

        expect(mailFactory).toHaveBeenCalled();
        expect(mailFactory).toHaveBeenCalledTimes(1);
        expect(mailFactory).toHaveBeenCalledWith("Hello World!");
    });

    it("should addObject to container", async () => {
        const container = await createContainer();

        const car = {
            model: "ford",
            type: "mustang",
            color: "black"
        };

        container.addObject(car, "myCar");

        expect(container.get("myCar")).toStrictEqual(car);
    });

    it("should removeObject from the container", async () => {
        const container = await createContainer();

        let mailService = container.get<MailService>("mailService");

        expect(mailService).toBeDefined();
        expect(mailService).toBeInstanceOf(MailService);

        container.removeObject("mailService");

        mailService = container.get<MailService>("mailService");

        expect(mailService).toBeUndefined();
    });

    it("should get factory method", async () => {
        const container = await createContainer();

        const mailFactory = container.get<(message: string) => Mail>("mail");

        const mail = await mailFactory("Hello World!");

        expect(mail).toBeInstanceOf(Mail);
        expect(mail.message).toBe("Hello World!");
    });

    it("should invoke @init method", async () => {
        const container = await createContainer();

        const mailManager = container.get<MailManager>("mailManager");

        expect(mailManager.initialized).toBeTruthy();
    });

    it("should create object as singleton", async () => {
        const container = await createContainer();

        const mailManager = container.get<MailManager>("mailManager");

        const mailManager2 = container.get<MailManager>("mailManager");

        expect(mailManager).toStrictEqual(mailManager2);

    });

    it("should throw error when adding an object with a name that already defined", async () => {
        const container = await createContainer();

        expect(() => {
            container.addObject({}, "mailService");
        }).toThrowError(
            "Module 'mailService' already defined."
        );
    });

    it("should throw error on @init method error", async () => {
        const container = Injex.create({
            rootDirs: [
                path.resolve(__dirname, "__mocks__/willThrow")
            ],
            globPattern: "/**/badService.ts"
        });

        expect(container.bootstrap()).rejects.toThrowError(
            "Failed to initialize module 'badService'."
        );
    });

    it("should throw error when module dependency not found", async () => {
        const container = Injex.create({
            rootDirs: [
                path.resolve(__dirname, "__mocks__/willThrow")
            ],
            globPattern: "/**/unknownService.ts"
        });

        expect(container.bootstrap()).rejects.toThrowError(
            "Dependency 'atlantisLocation' was not found for module 'unknownService'."
        );
    });

    it("should return undefined when module is not found in the module registry", async () => {
        const container = await createContainer();

        const service = container.get("maybeExistService");

        expect(service).toBeUndefined();

    });

    it("should throw when two modules defined with the same name", async () => {
        const container = Injex.create({
            rootDirs: [
                path.resolve(__dirname, "__mocks__/willThrow")
            ],
            globPattern: "/**/dupService*.ts"
        });

        expect(container.bootstrap()).rejects.toThrowError(
            "Module 'dupService1' already defined."
        );
    });

    it("should throw error when two modules defined with the bootstrap decorator", async () => {
        const container = Injex.create({
            rootDirs: [
                path.resolve(__dirname, "__mocks__/willThrow")
            ],
            globPattern: "/**/*Bootstrap.ts"
        });

        expect(container.bootstrap()).rejects.toThrowError(
            "Module 'Symbol(bootstrapModule)' already defined."
        );
    });

    it("should throw error when one of the rootDirs is not exists", async () => {
        const container = Injex.create({
            rootDirs: [
                "./some_fake_path"
            ]
        });

        expect(container.bootstrap()).rejects.toThrowError(
            "Root directory './some_fake_path' doesn't exist."
        );
    });
});