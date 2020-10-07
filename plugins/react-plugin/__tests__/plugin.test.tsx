//@ts-nocheck
import * as React from "react";
import { alias, AliasMap, bootstrap, define, inject, singleton } from "@injex/core";
import InjexMock from "./__mocks__/InjexMock";
import { ReactPlugin } from "../src/ReactPlugin";
import { RenderInjexProvider } from "../src/interfaces";
import { useInjex } from "../src/hooks/useInjex";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("Plugin", () => {

    it("should render", async () => {

        @bootstrap()
        class Bootstrap {
            @inject() private renderInjexProvider: RenderInjexProvider;

            public run() {
                this.renderInjexProvider(
                    <div>Test</div>
                );
            }
        }

        await InjexMock.create({
            modules: [
                { Bootstrap }
            ],
            plugins: [
                new ReactPlugin({
                    render
                })
            ]
        }).bootstrap();

        expect(screen.queryByText("Test")).toHaveTextContent("Test");
    });

    it("should get module from container using useInjex hook", async () => {
        function Home() {
            const [get] = useInjex();
            const userService = get<UserService>("userService");

            return (
                <div className="home">{userService.name}, {userService.role}</div>
            );
        }

        @bootstrap()
        class Bootstrap {
            @inject() private renderInjexProvider: RenderInjexProvider;

            public run() {
                this.renderInjexProvider(<Home />);
            }
        }

        @define()
        @singleton()
        class UserService {
            public name: string;
            public role: string;

            constructor() {
                this.name = "Udi Talias";
                this.role = "Author";
            }
        }

        await InjexMock.create({
            modules: [
                { Bootstrap }, { UserService }
            ],
            plugins: [
                new ReactPlugin({
                    render
                })
            ]
        }).bootstrap();

        expect(screen.getByText("Udi Talias, Author")).toBeDefined();
    });

    it("should getAlias modules from container using useInjex hook", async () => {
        function AnimalSound({ name }) {
            const [_, getAlias] = useInjex();
            const animals = getAlias<string, Animal>("Animal", "name") as AliasMap<string, Animal>;
            const animal = animals[name];

            return (
                <div className="animal">{animal.talk()}</div>
            );
        }

        abstract class Animal {
            public abstract talk(): string;
        }

        @define()
        @singleton()
        @alias("Animal")
        class Dog extends Animal {
            public readonly name = "dog";

            public talk(): string {
                return "Woof Woof!";
            }
        }

        @bootstrap()
        class Bootstrap {
            @inject() private renderInjexProvider: RenderInjexProvider;

            public run() {
                this.renderInjexProvider(<AnimalSound name={"dog"} />);
            }
        }

        await InjexMock.create({
            modules: [
                { Bootstrap }, { Dog }
            ],
            plugins: [
                new ReactPlugin({
                    render
                })
            ]
        }).bootstrap();

        expect(screen.getByText("Woof Woof!")).toBeDefined();
    });
});