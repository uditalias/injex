import { define, singleton } from "../src";
import { metadataSymbol } from "../src/metadataHandlers";

describe("Debug TC39 Decorators", () => {
    it("should have Symbol.metadata on decorated class", () => {
        @define()
        @singleton()
        class TestClass { }

        console.log("TestClass:", TestClass);
        console.log("Symbol.metadata:", Symbol.metadata);
        console.log("TestService[Symbol.metadata]:", TestService[Symbol.metadata]);

        expect(Symbol.metadata).toBeDefined();
        expect(TestService[Symbol.metadata]).toBeDefined();
    });

    it("should store metadata in correct location", () => {
        @define("testService")
        @singleton()
        class TestService { }

        const metadata = TestService[Symbol.metadata];
        console.log("Full metadata:", metadata);
        console.log("metadataSymbol:", metadataSymbol);
        console.log("metadata[metadataSymbol]:", metadata?.[metadataSymbol]);

        expect(metadata).toBeDefined();
        expect(metadata[metadataSymbol]).toBeDefined();
    });
});
