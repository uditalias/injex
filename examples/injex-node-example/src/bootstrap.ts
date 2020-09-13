import { bootstrap, IBootstrap, inject } from "@injex/core";
import { MailService } from "./services/mailService";

@bootstrap()
export class Bootstrap implements IBootstrap {

    @inject() private mailService: MailService;

    public run(): void | Promise<void> {
        this.mailService.send("Hello World!");
    }

    public didCatch(e: Error): void {

    }
}