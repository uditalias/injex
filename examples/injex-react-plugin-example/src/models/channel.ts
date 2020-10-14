import { define } from "@injex/core";
import { timeStamp } from "console";
import IChatMessage from "interfaces/IChatMessage";
import { observable } from "mobx";

@define("createChannel")
export class Channel {

    @observable public isConnecting: boolean;
    @observable public connected: boolean;
    @observable public messages: IChatMessage[];
    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    public connect() {
        if (this.connected || this.isConnecting) {
            return;
        }

        this.isConnecting = true;
    }
}