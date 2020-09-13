import { bootstrap, IBootstrap, inject } from "@injex/core";
import { Application } from "express";
import IEnvironment from "./interfaces/IEnvironment";

@bootstrap()
export class Bootstrap implements IBootstrap {
    @inject() private env: IEnvironment;
    @inject() private expressApp: Application;

    public run(): void | Promise<void> {
        this.expressApp.listen(this.env.port, () => console.log(`🌍 Server is running on port ${this.env.port}...`));
    }

    public didCatch(e: Error): void {
        console.error(e);
        process.exit(1);
    }
}