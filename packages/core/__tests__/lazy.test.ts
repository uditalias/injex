//@ts-nocheck
import exp from "constants";
import { Factory, alias, bootstrap, define, inject, injectAlias, lazy, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";
import { LazyModule } from "./__mocks__/LazyModule";

let ID_GENERATOR = 0;

describe("Lazy", () => {

    it("should inject a lazy module as singleton object", async () => {

        @define()
        @singleton()
        class Zebra {
            public id: number;

            constructor() {
                this.id = ++ID_GENERATOR;
            }

            public makeNoise() {
                return "Zebra noise...";
            }
        }

        @define()
        @singleton()
        @lazy()
        class AnimalLoader {
            public async import() {
                return Promise.resolve(Zebra);
            }
        }

        @define()
        @singleton()
        class Zoo {
            @inject() public zebra: Zebra;
        }

        @bootstrap()
        class Bootstrap {

            @inject() private animalLoader: Factory<Promise<Zebra>>;
            @inject() private $injex: InjexMock;

            public async run() {
                await this.animalLoader();
            }
        }

        const container = InjexMock.create({
            modules: [
                { Bootstrap, Zoo, AnimalLoader },
            ]
        });

        await container.bootstrap();

        const zoo = container.get<Zoo>("zoo");
        const zebraFromContainer = container.get<Zebra>("zebra");

        expect(zoo).toBeDefined();
        expect(zoo.zebra).toBeInstanceOf(Zebra);
        expect(zoo.zebra.id).toEqual(1);

        expect(zebraFromContainer).toBeInstanceOf(Zebra);
        expect(zebraFromContainer.id).toEqual(1);
        expect(zebraFromContainer).toEqual(zoo.zebra);
    });

    it("should dynamically inject a lazy module as an alias of another module", async () => {
        @define()
        @singleton()
        @alias('Disposable')
        class Zebra {
            public id: number;

            constructor() {
                this.id = ++ID_GENERATOR;
            }

            public makeNoise() {
                return "Zebra noise...";
            }
        }

        @define()
        @singleton()
        @lazy()
        class AnimalLoader {
            public async import() {
                return Promise.resolve(Zebra);
            }
        }

        @bootstrap()
        class Bootstrap {
            @inject() private animalLoader: Factory<Promise<Zebra>>;
            @injectAlias("Disposable") private disposables: any[];

            public async run() {
                expect(this.disposables).toBeDefined();

                expect(this.disposables.length).toEqual(0);

                await this.animalLoader();

                expect(this.disposables.length).toEqual(1);
            }
        }

        const container = InjexMock.create({
            modules: [
                { Bootstrap, AnimalLoader },
            ]
        });

        await container.bootstrap();
    });

    it("should dynamically import module and ad it as a module", async () => {

        @define()
        @singleton()
        class MyManager {
            @inject() public lazyModule: LazyModule;
        }

        @bootstrap()
        class Bootstrap {
            @inject() private $injex: InjexMock;

            public async run() {
                const LazyModule = (await import('./__mocks__/LazyModule')).LazyModule;
                this.$injex.addModule(LazyModule);
            }
        }

        const container = InjexMock.create({
            modules: [
                { Bootstrap, MyManager },
            ]
        });

        await container.bootstrap();

        const manager = container.get<MyManager>("myManager");

        expect(manager.lazyModule).toBeDefined();
        expect(manager.lazyModule).toBeInstanceOf(LazyModule);

        const lazyModule = container.get<LazyModule>("lazyModule");
        expect(lazyModule.sayHello()).toEqual("I'm a lazy module!");
        expect(lazyModule).toEqual(manager.lazyModule);
    });
});