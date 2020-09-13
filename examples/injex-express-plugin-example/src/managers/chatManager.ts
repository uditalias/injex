import { define, singleton } from "@injex/core";
import IMessage from "../interfaces/IMessage";

@define()
@singleton()
export class ChatManager {

    private _messages: IMessage[];

    constructor() {
        this._messages = [];
    }

    public getAllMessages(): IMessage[] {
        return this._messages;
    }

    public addMessage(message: string) {
        this._messages.push({
            text: message,
            date: Date.now()
        });
    }
}