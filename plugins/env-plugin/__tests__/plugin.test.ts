import { EnvPlugin } from "../src/EnvPlugin";
import { Injex } from "@injex/node";
import { env } from "process";

describe("Plugin", () => {

    it("should create Plugin with default config", () => {

        const plugin = new EnvPlugin();

        expect(plugin).toBeDefined();
        expect(plugin).toBeInstanceOf(EnvPlugin);
    });

    it("should get the actual environment", async () => {
        const container = Injex.create({
            rootDirs: [],
            plugins: [
                new EnvPlugin({
                    environments: {
                        "development": {
                            appleId: "11111",
                            googleId: "22222"
                        },
                        "test": {
                            appleId: "12345",
                            googleId: "67890"
                        }
                    }
                })
            ]
        });

        await container.bootstrap();

        const environment = container.get("env");

        expect(environment.appleId).toBe("12345");
        expect(environment.googleId).toBe("67890");
    });

    it("should override default values", async () => {
        const container = Injex.create({
            rootDirs: [],
            plugins: [
                new EnvPlugin({
                    defaults: {
                        googleId: "11111"
                    },
                    environments: {
                        "development": {
                            googleId: "22222"
                        },
                        "test": {
                            googleId: "67890"
                        }
                    }
                })
            ]
        });

        await container.bootstrap();

        const environment = container.get("env");

        expect(environment.googleId).toBe("67890");
    });

    it("should use default values", async () => {
        interface IEnv {
            appleId?: string;
            googleId?: string;
        }

        const container = Injex.create({
            rootDirs: [],
            plugins: [
                new EnvPlugin<IEnv>({
                    defaults: {
                        appleId: "11111",
                        googleId: "22222"
                    },
                    environments: {
                        "development": {
                            googleId: "33333"
                        },
                        "test": {
                            googleId: "67890"
                        }
                    }
                })
            ]
        });

        await container.bootstrap();

        const environment = container.get("env");

        expect(environment.appleId).toBe("11111");
    });
});