import { define, inject } from "@injex/core";
import IChatMessage from "interfaces/IChatMessage";
import { AuthManager } from "managers/authManager";
import { UsersManager } from "managers/usersManager";
import { IObservableArray, observable } from "mobx";
import { FirebaseService } from "services/firebaseService";

@define("createChannel")
export class Channel {

    @inject() private firebaseService: FirebaseService;
    @inject() private authManager: AuthManager;
    @inject() private usersManager: UsersManager;

    @observable public connected: boolean;
    @observable public messages: IObservableArray<IChatMessage>;
    public name: string;

    constructor(name: string) {
        this.name = name;
        this.messages = observable.array([], { deep: false });
    }

    public connect() {
        if (this.connected) {
            return;
        }

        this.connected = true;

        this.firebaseService.database.ref(`/channel/${this.name}`)
            .orderByChild("created")
            .limitToLast(10)
            .on("child_added", async (child) => {
                const message = child.val();
                message.id = child.key;
                message.self = message.from === this.authManager.user.id;
                message.from = await this.usersManager.getById(message.from);

                this.messages.push(message);

                this.messages.replace(
                    this.messages.slice().sort((m1, m2) => m1.created - m2.created)
                );
            });
    }

    public sendMessage(message: string) {
        this.firebaseService.database.ref(`/channel/${this.name}`).push({
            channel: this.name,
            created: Date.now(),
            from: this.authManager.user.id,
            text: message
        });
    }
}