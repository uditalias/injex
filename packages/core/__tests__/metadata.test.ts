import { alias, define, inject, init, ready, singleton } from "../src";
import { metadataSymbol } from "../src/metadataHandlers";

describe("TC39 Metadata System", () => {
    it("should store metadata on Symbol.metadata", () => {
        @define()
        @singleton()
        class TestService { }

        expect(TestService[Symbol.metadata]).toBeDefined();
        expect(TestService[Symbol.metadata][metadataSymbol]).toBeDefined();
    });

    it("should store class decorator metadata", () => {
        @define("customName")
        @singleton()
        @alias("ITestService")
        class TestService { }

        const metadata = TestService[Symbol.metadata][metadataSymbol];

        expect(metadata.name).toBe("customName");
        expect(metadata.singleton).toBe(true);
        expect(metadata.aliases).toContain("ITestService");
        expect(metadata.item).toBe(TestService);
    });

    it("should store field decorator metadata", () => {
        @define()
        @singleton()
        class DependencyService { }

        @define()
        @singleton()
        class TestService {
            @inject() public dep: DependencyService;
        }

        const metadata = TestService[Symbol.metadata][metadataSymbol];

        expect(metadata.dependencies).toBeDefined();
        expect(metadata.dependencies).toHaveLength(1);
        expect(metadata.dependencies[0].label).toBe("dep");
    });

    it("should store method decorator metadata", () => {
        @define()
        @singleton()
        class TestService {
            @init()
            public initialize() { }

            @ready()
            public onReady() { }
        }

        const metadata = TestService[Symbol.metadata][metadataSymbol];

        expect(metadata.initMethod).toBe("initialize");
        expect(metadata.readyMethod).toBe("onReady");
    });

    it("should accumulate multiple field decorators", () => {
        @define()
        @singleton()
        class Dep1 { }

        @define()
        @singleton()
        class Dep2 { }

        @define()
        @singleton()
        class Dep3 { }

        @define()
        @singleton()
        class TestService {
            @inject() public dep1: Dep1;
            @inject() public dep2: Dep2;
            @inject() public dep3: Dep3;
        }

        const metadata = TestService[Symbol.metadata][metadataSymbol];

        expect(metadata.dependencies).toHaveLength(3);
        expect(metadata.dependencies.map((d: any) => d.label)).toEqual(["dep1", "dep2", "dep3"]);
    });

    it("should support decorator inheritance", () => {
        @define()
        @singleton()
        class BaseService {
            @inject() public baseField: string;

            @init()
            public baseInit() { }
        }

        @define()
        @singleton()
        class ChildService extends BaseService {
            @inject() public childField: string;

            @ready()
            public childReady() { }
        }

        const childMetadata = ChildService[Symbol.metadata][metadataSymbol];
        const baseMetadata = BaseService[Symbol.metadata][metadataSymbol];

        // Child should have its own metadata
        expect(childMetadata.dependencies).toBeDefined();
        expect(childMetadata.readyMethod).toBe("childReady");

        // Parent should have its own metadata
        expect(baseMetadata.dependencies).toBeDefined();
        expect(baseMetadata.initMethod).toBe("baseInit");
    });

    it("should not pollute parent class metadata from child", () => {
        @define()
        @singleton()
        class ParentService {
            @inject() public parentDep: string;
        }

        @define()
        @singleton()
        class ChildService extends ParentService {
            @inject() public childDep: string;
        }

        const parentMetadata = ParentService[Symbol.metadata][metadataSymbol];
        const childMetadata = ChildService[Symbol.metadata][metadataSymbol];

        // Parent should only have parent dependencies
        expect(parentMetadata.dependencies).toHaveLength(1);
        expect(parentMetadata.dependencies[0].label).toBe("parentDep");

        // Child should only have child dependencies in its own metadata
        expect(childMetadata.dependencies).toHaveLength(1);
        expect(childMetadata.dependencies[0].label).toBe("childDep");
    });

    it("should store inject by type metadata", () => {
        @define()
        @singleton()
        class DependencyService { }

        @define()
        @singleton()
        class TestService {
            @inject(DependencyService) public dep: DependencyService;
        }

        const metadata = TestService[Symbol.metadata][metadataSymbol];

        expect(metadata.dependencies[0].value).toBe(DependencyService);
    });

    it("should store inject by name metadata", () => {
        @define()
        @singleton()
        class TestService {
            @inject("customDep") public dep: any;
        }

        const metadata = TestService[Symbol.metadata][metadataSymbol];

        expect(metadata.dependencies[0].value).toBe("customDep");
    });

    it("should work with multiple decorator types on same class", () => {
        @define("complexService")
        @singleton()
        @alias("IComplexService", "IService")
        class ComplexService {
            @inject() public dep1: any;
            @inject() public dep2: any;

            @init()
            public initialize() { }

            @ready()
            public onReady() { }
        }

        const metadata = ComplexService[Symbol.metadata][metadataSymbol];

        expect(metadata.name).toBe("complexService");
        expect(metadata.singleton).toBe(true);
        expect(metadata.aliases).toHaveLength(2);
        expect(metadata.dependencies).toHaveLength(2);
        expect(metadata.initMethod).toBe("initialize");
        expect(metadata.readyMethod).toBe("onReady");
    });
});
