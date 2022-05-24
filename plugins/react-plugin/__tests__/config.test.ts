import * as ReactDom from "react-dom";
import createConfig from "../src/createConfig";

describe("Config", () => {

    it("should create config with default values", () => {

        const config = createConfig();

        expect(config.rootElementOrSelector).toBeNull()

    });

    it("should create config with override entries", () => {
        const config = createConfig({
            rootElementOrSelector: "#root"
        });

        expect(config.rootElementOrSelector).toBe("#root");
    });
});