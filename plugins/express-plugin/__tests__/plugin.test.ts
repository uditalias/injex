import { ExpressPlugin } from "../src/ExpressPlugin";
import * as express from "express";
import * as path from "path";
import { Injex } from "@injex/node";
import * as http from "http";

const PORT = 8081;

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

	it("should create plugin with express routes and middlewares (e2e)", async () => {

		const app = express();
		const server = app.listen(PORT);

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

		const homeResponse = await get(`http://localhost:${PORT}/`);
		expect(homeResponse).toBe("<h1>Welcome home!</h1>");

		const categoryResponse = await get(`http://localhost:${PORT}/cat/lifestyle`);
		expect(categoryResponse).toBe("<h1>Welcome to lifestyle category</h1>");

		// test middleware failure
		const cartResponseUnauthorized = await get(`http://localhost:${PORT}/cart`);
		expect(cartResponseUnauthorized).toBe("unauthorize");

		// test middleware pass
		const cartResponseAuthorized = await get(`http://localhost:${PORT}/cart?token=123456`);
		expect(cartResponseAuthorized).toBe("<h1>This is your cart</h1>");

		server.close();
	});
});