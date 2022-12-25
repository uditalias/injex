import { bootstrap, IBootstrap, inject } from "@injex/core";
import { Store } from "./store";

@bootstrap()
export class Bootstrap implements IBootstrap {
    @inject() private store: Store;

    public run() {
        this.store.Id = "123";
    }
}