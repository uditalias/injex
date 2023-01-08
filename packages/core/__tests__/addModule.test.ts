//@ts-nocheck
import { bootstrap, define, inject, ready, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("addModule", () => {

    it("should add and inject a module", async () => {
        @define()
        @singleton()
        class TheStudent {
            public whoAmI(): string {
                return "I'm the student!";
            }
        }

        @define()
        @singleton()
        class University {
            @inject() public theStudent: TheStudent;
            @inject() private $injex: InjexMock;

            @ready()
            private _afterBootstrap() {
                // this will throw an error in case we have an issue
                // in the `addModule` process.
                this.theStudent.whoAmI();
            }
        }

        @bootstrap()
        class Bootstrap {

            @inject() private $injex: InjexMock;

            public async run() {
                await this.$injex.addModule(TheStudent);
            }
        }

        const container = InjexMock.create({
            modules: [
                { Bootstrap, University },
            ]
        });

        await container.bootstrap();

        const university = container.get<University>('university');

        expect(university).toBeDefined();
        expect(university).toBeInstanceOf(University);

        expect(university.theStudent.whoAmI()).toEqual("I'm the student!");

    });

    it("should add module before bootstrap and inject it", async () => {
        @define()
        @singleton()
        class TheStudent {
            public whoAmI(): string {
                return "I'm the student!";
            }
        }

        @define()
        @singleton()
        class University {
            @inject() public theStudent: TheStudent;

            @ready()
            private _afterBootstrap() {
                // this will throw an error in case we have an issue
                // in the `addModule` process.
                this.theStudent.whoAmI();
            }
        }

        const container = InjexMock.create({
            modules: [
                { University },
            ]
        });

        container.addModule(TheStudent);

        await container.bootstrap();

        const university = container.get<University>('university');

        expect(university.theStudent).toBeDefined();
        expect(university.theStudent).toBeInstanceOf(TheStudent);

        expect(university.theStudent.whoAmI()).toEqual("I'm the student!");
    });
});