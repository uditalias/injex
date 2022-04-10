//@ts-nocheck
import { define, ready, singleton } from "../src";
import InjexMock from "./__mocks__/InjexMock";

describe("Ready", () => {

    it("should run ready method", async () => {

        const fn = jest.fn();

        @define()
        @singleton()
        class MailService {
            @ready()
            public onReady() {
                fn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailService }
            ]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should run ready for sync factory method", async () => {
        const fn = jest.fn();

        @define()
        class MailMessage {
            @ready()
            public onReady() {
                fn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { MailMessage }
            ]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(0);

        const createMailMessage = container.get("mailMessage");
        const mailMessage = createMailMessage();

        expect(mailMessage).toBeDefined();
        expect(mailMessage).toBeInstanceOf(MailMessage);
    });

    it("should run multiple ready methods on class inheritance", async () => {
        const fn = jest.fn();
        class Animal {
            @ready()
            public onReady() {
                fn();
            }
        }

        @define()
        class Dog extends Animal {
            @ready()
            public onDogReady() {
                fn();
            }
        }

        const container = InjexMock.create({
            modules: [
                { Dog }
            ]
        });

        await container.bootstrap();

        const createDog = container.get("dog");
        const dog = createDog();

        expect(dog).toBeInstanceOf(Dog);
        expect(fn).toHaveBeenCalledTimes(2);
    });
});