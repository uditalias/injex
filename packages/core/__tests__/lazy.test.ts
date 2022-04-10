//@ts-nocheck
import { inject, bootstrap, define, Factory, lazy, singleton } from "../src";
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
            @inject() private animalLoader: Factory<Promise<Zebra>>;
            @inject() public zebra: Zebra;

            public craeteAnotherAnimal() {
                return this.animalLoader();
            }
        }

        @bootstrap()
        class Bootstrap {

            @inject() private animalLoader: Factory<Promise<Zebra>>;
            @inject() private $injex: InjexMock;

            public async run() {
                const zebra = await this.animalLoader();

                this.$injex.addObject(zebra, "zebra");
            }
        }

        const container = InjexMock.create({
            modules: [
                { Bootstrap, Zoo, AnimalLoader },
            ]
        });

        await container.bootstrap();

        const zoo = container.get<Zoo>("zoo");

        expect(zoo).toBeDefined();
        expect(zoo.zebra).toBeInstanceOf(Zebra);
        expect(zoo.zebra.id).toEqual(1);

        const zebraFromZoo = await zoo.craeteAnotherAnimal();
        expect(zoo.zebra).toBeInstanceOf(Zebra);
        expect(zebraFromZoo.id).toEqual(1);
        expect(zebraFromZoo).toEqual(zoo.zebra);
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