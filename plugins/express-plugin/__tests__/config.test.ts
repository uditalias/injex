import createConfig, { noop } from "../src/createConfig";
import { IExpressPluginConfig } from "../src/interfaces";

describe("Config", () => {

	it("should create config with default values", () => {

		const config = createConfig();

		expect(config.app).toBe(null);
		expect(config.createAppCallback).toBe(noop);

	});

	it("should create config with override entries", () => {

		const fn = jest.fn();

		const config = createConfig({
			createAppCallback: fn
		});

		expect(config.app).toBe(null);
		expect(config.createAppCallback).toBe(fn);
	});

	it("should create config with default values when non-configurable entries provided", () => {

		const config = createConfig({
			nonConfigurableConfig: 1
		} as IExpressPluginConfig);

		expect(config.app).toBe(null);
		expect(config.createAppCallback).toBe(noop);
	});
});