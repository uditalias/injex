import { Injex, DuplicateDefinitionError, InitializeMuduleError, ModuleDependencyNotFoundError } from "../src";
import * as path from "path";
import { MailManager } from "./__mocks__/general/mailManager";
import { MailService } from "./__mocks__/general/mailService";
import { Mail } from "./__mocks__/general/mail";
import { bootstrapSymbol } from "../src/constants";
import { IBootstrap } from "../src/interfaces";

describe("InjexContainer", () => {

	let container: Injex;

	beforeEach(async () => {
		container = Injex.create({
			rootDirs: [
				path.resolve(__dirname, "__mocks__/general")
			],
			globPattern: "/**/*.ts"
		});

		await container.bootstrap();
	});

	it("should create container", () => {
		expect(container).toBeDefined();
		expect(container).toBeInstanceOf(Injex);
	});

	it("should get object", () => {

		const mailManager = container.get<MailManager>("mailManager");
		const mailService = container.get<MailService>("mailService");

		expect(mailManager).toBeDefined();
		expect(mailService).toBeDefined();
		expect(mailManager).toBeInstanceOf(MailManager);
		expect(mailService).toBeInstanceOf(MailService);
	});

	it("should inject and use dependency", () => {

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

	it("should addObject to container", () => {

		const car = {
			model: "ford",
			type: "mustang",
			color: "black"
		};

		container.addObject(car, "myCar");

		expect(container.get("myCar")).toStrictEqual(car);
	});

	it("should removeObject from the container", () => {

		let mailService = container.get<MailService>("mailService");

		expect(mailService).toBeDefined();
		expect(mailService).toBeInstanceOf(MailService);

		container.removeObject("mailService");

		mailService = container.get<MailService>("mailService");

		expect(mailService).toBeUndefined();
	});

	it("should get factory method", async () => {

		const mailFactory = container.get<(message: string) => Mail>("mail");

		const mail = await mailFactory("Hello World!");

		expect(mail).toBeInstanceOf(Mail);
		expect(mail.message).toBe("Hello World!");

	});

	it("should invoke @init method", () => {

		const mailManager = container.get<MailManager>("mailManager");

		expect(mailManager.initialized).toBeTruthy();
	});

	it("should create object as singleton", () => {

		const mailManager = container.get<MailManager>("mailManager");

		const mailManager2 = container.get<MailManager>("mailManager");

		expect(mailManager).toStrictEqual(mailManager2);

	});

	it("should throw error when adding an object with a name that already defined", () => {

		expect(() => {
			container.addObject({}, "mailService");
		}).toThrowError(
			DuplicateDefinitionError
		);

	});

	it("should throw error on @init method error", async () => {

		let error;
		container = Injex.create({
			rootDirs: [
				path.resolve(__dirname, "__mocks__/willThrow")
			],
			globPattern: "/**/badService.ts"
		});

		try {
			await container.bootstrap();
		} catch (e) {
			error = e;
		}

		expect(error).toBeInstanceOf(InitializeMuduleError);
	});

	it("should throw error when module dependency not found", async () => {

		let error;
		container = Injex.create({
			rootDirs: [
				path.resolve(__dirname, "__mocks__/willThrow")
			],
			globPattern: "/**/unknownService.ts"
		});

		try {
			await container.bootstrap();
		} catch (e) {
			error = e;
		}

		expect(error).toBeInstanceOf(ModuleDependencyNotFoundError);

	});

	it("should return undefined when module is not found in the module registry", () => {

		const service = container.get("maybeExistService");

		expect(service).toBeUndefined();

	});

	it("should skip module registration when already exists", async () => {

		let error;
		container = Injex.create({
			rootDirs: [
				path.resolve(__dirname, "__mocks__/willThrow")
			],
			globPattern: "/**/dupService*.ts"
		});

		try {
			await container.bootstrap();
		} catch (e) {
			error = e;
		}

		expect(error).toBeInstanceOf(DuplicateDefinitionError);

	});

	it("should run bootstrap module run method", () => {

		const bootstrapClass = container.get<IBootstrap & { didRun: boolean; }>(bootstrapSymbol);

		expect(bootstrapClass.didRun).toBeTruthy();

	});

	it("should throw error when two modules defined with the bootstrap decorator", async () => {

		let error;
		try {
			container = Injex.create({
				rootDirs: [
					path.resolve(__dirname, "__mocks__/willThrow")
				],
				globPattern: "/**/*Bootstrap.ts"
			});

			await container.bootstrap();

		} catch (e) {
			error = e;
		}

		expect(error).toBeInstanceOf(DuplicateDefinitionError);
	});
});