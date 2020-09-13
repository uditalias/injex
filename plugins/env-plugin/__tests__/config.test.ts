import createConfig from "../src/createConfig";
import { IEnvPluginConfig } from "../src/interfaces";

describe("Config", () => {

	it("should create config with default values", () => {

		const config = createConfig();

		expect(config.current).toBe("test");
		expect(config.name).toBe("env");
		expect(Object.keys(config.defaults).length).toBe(0);
		expect(Object.keys(config.environments).length).toBe(0);
	});

	it("should create config with different name", () => {
		const config = createConfig({
			name: "environments"
		});

		expect(config.name).toBe("environments");
	});

	it("should create config with current environment", () => {

		const config = createConfig({
			current: "production"
		});

		expect(config.current).toBe("production");
	});

	it("should create config with default values", () => {

		const config = createConfig({
			defaults: {
				provider: "google"
			}
		});

		expect(config.defaults.provider).toBe("google");
	});

	it("should create config with environments", () => {
		const config = createConfig({
			environments: {
				development: {
					provider: "google"
				},
				production: {
					provider: "microsoft"
				}
			}
		});

		expect(config.environments.development.provider).toBe("google");
		expect(config.environments.production.provider).toBe("microsoft");
	});
});