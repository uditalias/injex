import * as ReactDom from "react-dom";
import createConfig from "../src/createConfig";

describe("Config", () => {

    it("should create config with default values", () => {

        const config = createConfig();

        expect(config.render).toBe(ReactDom.render);
        expect(config.rootElementOrSelector).toBeNull()

    });

    it("should create config with override entries", () => {

        const fn = jest.fn();

        const config = createConfig({
            render: fn,
            rootElementOrSelector: "#root"
        });

        expect(config.render).toBe(fn);
        expect(config.rootElementOrSelector).toBe("#root");
    });
});