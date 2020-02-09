import { Injex, LogLevel, errors, plugins } from "../src";
import * as path from "path";
import { IInjexPlugin } from "../src/interfaces";

describe("Plugins", () => {

	it("should log instance creation when using the HooksLoggerPlugin", async () => {

		const infoArgs = [];
		console.debug = jest.fn((...args) => {
			infoArgs.push.apply(infoArgs, args);
		});

		const container = Injex.create({
			rootDirs: [
				path.resolve(__dirname, "__mocks__/general")
			],
			globPattern: "/**/*.ts",
			logLevel: LogLevel.Debug,
			plugins: [
				new plugins.HooksLoggerPlugin()
			]
		});

		await container.bootstrap();

		expect(infoArgs.join(" ")).toContain("HooksLoggerPlugin Creating instance: ");
	});

	it("should throw error when plugin is not valid", async () => {

		let error;
		class FakePlugin { }

		try {
			const container = Injex.create({
				rootDirs: [
					path.resolve(__dirname, "__mocks__/general")
				],
				globPattern: "/**/*.ts",
				plugins: [
					new FakePlugin() as IInjexPlugin
				]
			});

			await container.bootstrap();

		} catch (e) {
			error = e;
		}

		expect(error).toBeInstanceOf(errors.InvalidPluginError);
	});

});