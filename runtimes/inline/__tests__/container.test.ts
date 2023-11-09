//@ts-nocheck
import { bootstrap, define, singleton } from "@injex/core";
import { Injex } from "../src";

describe("InjexInlineContainer", () => {

    it("should load modules", async () => {
        const container = Injex.create({ modules: [] });
        await container.bootstrap();

        expect(container).toBeDefined();
        expect(container).toBeInstanceOf(Injex);
    });

    it("should add modules to inline container", async () => {
        @define()
        @singleton()
        class MailService {

        }

        const container = Injex.create({
            modules: [MailService]
        });

        await container.bootstrap();

        const mailService = container.get('mailService');

        expect(mailService).toBeDefined();
        expect(mailService).toBeInstanceOf(MailService);
    });

    it("should execute the bootstrap run() method", async () => {
        const fn = jest.fn();

        @bootstrap()
        class Bootstrap {
            run() {
                fn();
            }
        }

        const container = Injex.create({
            modules: [Bootstrap]
        });

        await container.bootstrap();

        expect(fn).toHaveBeenCalledTimes(1);
    });
});