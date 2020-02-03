import { ensureMetadata, hasMetadata, getMetadata, setMetadata, pushMetadata } from "../src/utils/metadata";

describe("Metadata", () => {

	it("should ensureMetadata", () => {

		class MyClass {

		}

		ensureMetadata(MyClass.prototype);
		expect(hasMetadata(MyClass.prototype)).toBeTruthy();
	});

	it("should getMetadata", () => {

		class MyClass {

		}

		expect(hasMetadata(MyClass.prototype)).toBeFalsy();

		ensureMetadata(MyClass.prototype);

		expect(getMetadata(MyClass.prototype)).toEqual({});
	});

	it("should setMetadata", () => {

		class MyClass {

		}

		setMetadata(MyClass.prototype, "name", "myClass");
		setMetadata(MyClass.prototype, "singleton", true);

		const metadata = getMetadata(MyClass.prototype);

		expect(metadata.singleton).toBe(true);
		expect(metadata.name).toBe("myClass");
	});

	it("should pushMetadata", () => {

		class MyClass {

		}

		pushMetadata(MyClass.prototype, "dependencies", "myClass");

		const metadata = getMetadata(MyClass.prototype);

		expect(metadata.dependencies).toContain("myClass");
	});
});