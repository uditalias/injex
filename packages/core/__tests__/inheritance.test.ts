import { define, inject, init, ready, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Decorator Inheritance", () => {
    it("should inject dependencies from parent class", async () => {
        @define()
        @singleton()
        class DependencyService {
            public value = "dependency";
        }

        @define()
        @singleton()
        abstract class BaseService {
            @inject() protected dep: DependencyService;
        }

        @define()
        @singleton()
        class ChildService extends BaseService {
            public getValue() {
                return this.dep.value;
            }
        }

        const container = InjexMock.create({
            modules: [
                { DependencyService },
                { ChildService },
            ]
        });

        await container.bootstrap();

        const child = container.get<ChildService>("childService");

        expect(child.getValue()).toBe("dependency");
    });

    it("should call init methods from parent to child", async () => {
        const callOrder: string[] = [];

        @define()
        @singleton()
        abstract class GrandParent {
            @init()
            public initGrandParent() {
                callOrder.push("grandparent");
            }
        }

        @define()
        @singleton()
        abstract class Parent extends GrandParent {
            @init()
            public initParent() {
                callOrder.push("parent");
            }
        }

        @define()
        @singleton()
        class Child extends Parent {
            @init()
            public initChild() {
                callOrder.push("child");
            }
        }

        const container = InjexMock.create({
            modules: [
                { Child },
            ]
        });

        await container.bootstrap();

        expect(callOrder).toEqual(["grandparent", "parent", "child"]);
    });

    it("should call ready methods from parent to child", async () => {
        const callOrder: string[] = [];

        @define()
        @singleton()
        abstract class GrandParent {
            @ready()
            public readyGrandParent() {
                callOrder.push("grandparent");
            }
        }

        @define()
        @singleton()
        abstract class Parent extends GrandParent {
            @ready()
            public readyParent() {
                callOrder.push("parent");
            }
        }

        @define()
        @singleton()
        class Child extends Parent {
            @ready()
            public readyChild() {
                callOrder.push("child");
            }
        }

        const container = InjexMock.create({
            modules: [
                { Child },
            ]
        });

        await container.bootstrap();

        expect(callOrder).toEqual(["grandparent", "parent", "child"]);
    });

    it("should inject different dependencies in parent and child", async () => {
        @define()
        @singleton()
        class ParentDependency {
            public value = "parent-dep";
        }

        @define()
        @singleton()
        class ChildDependency {
            public value = "child-dep";
        }

        @define()
        @singleton()
        abstract class BaseService {
            @inject() protected parentDependency: ParentDependency;

            public getParentValue() {
                return this.parentDependency.value;
            }
        }

        @define()
        @singleton()
        class ChildService extends BaseService {
            @inject() protected childDependency: ChildDependency;

            public getChildValue() {
                return this.childDependency.value;
            }
        }

        const container = InjexMock.create({
            modules: [
                { ParentDependency },
                { ChildDependency },
                { ChildService },
            ]
        });

        await container.bootstrap();

        const child = container.get<ChildService>("childService");

        expect(child.getParentValue()).toBe("parent-dep");
        expect(child.getChildValue()).toBe("child-dep");
    });

    it("should support multiple inheritance levels", async () => {
        @define()
        @singleton()
        class Level1Dep {
            public value = "level1";
        }

        @define()
        @singleton()
        class Level2Dep {
            public value = "level2";
        }

        @define()
        @singleton()
        class Level3Dep {
            public value = "level3";
        }

        abstract class Level1 {
            @inject() protected dep1: Level1Dep;
        }

        abstract class Level2 extends Level1 {
            @inject() protected dep2: Level2Dep;
        }

        @define()
        @singleton()
        class Level3 extends Level2 {
            @inject() protected dep3: Level3Dep;

            public getAllValues() {
                return {
                    level1: this.dep1.value,
                    level2: this.dep2.value,
                    level3: this.dep3.value,
                };
            }
        }

        const container = InjexMock.create({
            modules: [
                { Level1Dep },
                { Level2Dep },
                { Level3Dep },
                { Level3 },
            ]
        });

        await container.bootstrap();

        const level3 = container.get<Level3>("level3");
        const values = level3.getAllValues();

        expect(values.level1).toBe("level1");
        expect(values.level2).toBe("level2");
        expect(values.level3).toBe("level3");
    });

    it("should allow child to override parent methods with decorators", async () => {
        const initCalls: string[] = [];

        @define()
        @singleton()
        abstract class Parent {
            @init()
            public initialize() {
                initCalls.push("parent-init");
            }
        }

        @define()
        @singleton()
        class Child extends Parent {
            @init()
            public initialize() {
                super.initialize();
                initCalls.push("child-init");
            }
        }

        const container = InjexMock.create({
            modules: [
                { Child },
            ]
        });

        await container.bootstrap();

        // Both should be called due to prototype chain
        expect(initCalls).toContain("parent-init");
        expect(initCalls).toContain("child-init");
    });

    it("should work with abstract classes in inheritance chain", async () => {
        @define()
        @singleton()
        class SharedDep {
            public value = 42;
        }

        abstract class AbstractBase {
            @inject() protected shared: SharedDep;

            public abstract getValue(): number;
        }

        abstract class AbstractMiddle extends AbstractBase {
            protected multiplier = 2;

            public getMultipliedValue(): number {
                return this.getValue() * this.multiplier;
            }
        }

        @define()
        @singleton()
        class ConcreteService extends AbstractMiddle {
            public getValue(): number {
                return this.shared.value;
            }
        }

        const container = InjexMock.create({
            modules: [
                { SharedDep },
                { ConcreteService },
            ]
        });

        await container.bootstrap();

        const service = container.get<ConcreteService>("concreteService");

        expect(service.getValue()).toBe(42);
        expect(service.getMultipliedValue()).toBe(84);
    });
});
