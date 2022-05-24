//@ts-nocheck
import * as React from "react";
import { define, singleton } from "@injex/core";
import InjexMock from "./__mocks__/InjexMock";
import { ReactPlugin } from "../src/ReactPlugin";
import { useInjex } from "../src/hooks/useInjex";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import InjexProvider from "../src/InjexProvider";

describe("Context Provider", () => {

    it("should render standalone provider", async () => {

        const container = await InjexMock.create({
            modules: [],
            plugins: [
                new ReactPlugin({
                    rootElementOrSelector: '#root'
                })
            ]
        }).bootstrap();

        const dom = render(
            <InjexProvider container={container}>
                <div id="title">Injex Provider</div>
            </InjexProvider>
        );

        expect(dom.container.querySelector("#title")).toHaveTextContent("Injex Provider");
    });

    it("should access module using standalone provider", async () => {
        function Home() {
            const [inject] = useInjex();
            const userService = inject<UserService>("userService");

            return (
                <div>{userService.name}, {userService.role}</div>
            );
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

        const container = await InjexMock.create({
            modules: [
                { UserService }
            ],
            plugins: [
                new ReactPlugin({
                    rootElementOrSelector: '#root'
                })
            ]
        }).bootstrap();

        render(
            <InjexProvider container={container}>
                <Home />
            </InjexProvider>
        );

        expect(screen.getByText("Udi Talias, Author")).toHaveTextContent("Udi Talias, Author");
    });
});