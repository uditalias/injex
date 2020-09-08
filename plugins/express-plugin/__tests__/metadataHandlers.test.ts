import metadataHandlers from "../src/metadataHandlers";

describe("Metadata", () => {

    it("should ensureMetadata", () => {

        class MyClass {

        }

        metadataHandlers.ensureMetadata(MyClass.prototype);
        expect(metadataHandlers.hasMetadata(MyClass.prototype)).toBeTruthy();
    });

    it("should getMetadata", () => {

        class MyClass {

        }

        expect(metadataHandlers.hasMetadata(MyClass.prototype)).toBeFalsy();

        metadataHandlers.ensureMetadata(MyClass.prototype);

        expect(metadataHandlers.getMetadata(MyClass.prototype)).toEqual({});
    });

    it("should setMetadata", () => {

        class MyClass {

        }

        const route = {
            path: "/",
            method: "get",
            handler: "render"
        };

        metadataHandlers.setMetadata(MyClass.prototype, "routes", route);

        const metadata = metadataHandlers.getMetadata(MyClass.prototype);

        expect(metadata.routes).toBeDefined();
    });

    it("should pushMetadata", () => {

        class MyClass {

        }

        const route = {
            path: "/",
            method: "get",
            handler: "render"
        };

        metadataHandlers.pushMetadata(MyClass.prototype, "routes", route);

        const metadata = metadataHandlers.getMetadata(MyClass.prototype);

        expect(metadata.routes).toContain(route);
    });
});
