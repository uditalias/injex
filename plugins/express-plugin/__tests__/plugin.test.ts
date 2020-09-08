import { ExpressPlugin } from "../src/ExpressPlugin";
import * as express from "express";
import * as path from "path";
import { Injex } from "@injex/node";
import * as http from "http";

function get(url): Promise<string> {
	return new Promise((resolve) => {
		http.get(url, (res) => {
			res.on("data", function (data) {
				resolve(data.toString());
			});
		});
	});
}

describe("Plugin", () => {

	it("should create Plugin with default config", () => {

		const plugin = new ExpressPlugin();

		expect(plugin).toBeDefined();
		expect(plugin).toBeInstanceOf(ExpressPlugin);
	});

	it("should create plugin with express routes (e2e)", async () => {

		const app = express();
		const server = app.listen(8080);

		const expressPlugin = new ExpressPlugin({
			app
		});

		const container = Injex.create({

			rootDirs: [
				path.resolve(__dirname, "__mocks__/app")
			],

			globPattern: "/**/*.ts",

			plugins: [
				expressPlugin
			]
		});

		await container.bootstrap();

		const homeResponse = await get("http://localhost:8080/");
		expect(homeResponse).toBe("<h1>Welcome home!</h1>");

		const categoryResponse = await get("http://localhost:8080/cat/lifestyle");
		expect(categoryResponse).toBe("<h1>Welcome to lifestyle category</h1>");

		server.close();
	});
});