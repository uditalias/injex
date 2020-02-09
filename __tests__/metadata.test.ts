import metadataHandlers from "../src/utils/metadata";

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

		metadataHandlers.setMetadata(MyClass.prototype, "name", "myClass");
		metadataHandlers.setMetadata(MyClass.prototype, "singleton", true);

		const metadata = metadataHandlers.getMetadata(MyClass.prototype);

		expect(metadata.singleton).toBe(true);
		expect(metadata.name).toBe("myClass");
	});

	it("should pushMetadata", () => {

		class MyClass {

		}

		metadataHandlers.pushMetadata(MyClass.prototype, "dependencies", "myClass");

		const metadata = metadataHandlers.getMetadata(MyClass.prototype);

		expect(metadata.dependencies).toContain("myClass");
	});
});