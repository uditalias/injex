import { define, singleton, inject } from "@injex/core";
import { Hook } from "@injex/stdlib";
import { IChatUser } from "interfaces/IUser";
import { computed, observable } from "mobx";
import { FirebaseService } from "services/firebaseService";
import { AuthManager } from "./authManager";
import { UsersManager } from "./usersManager";

@define()
@singleton()
export class PresenceManager {

    @inject() private authManager: AuthManager;
    @inject() private usersManager: UsersManager;
    @inject() private firebaseService: FirebaseService;

    @observable private users: { [index: string]: IChatUser };

    constructor() {
        this.users = {};
    }

    @computed public get allUsers(): IChatUser[] {
        return Object.values(this.users);
    }

    public initialize() {
        this.firebaseService.database.ref('.info/connected').on('value', this._onConnection.bind(this));
    }

    private async _onConnection(snapshot) {
        const userStatusDatabaseRef = this.firebaseService.database.ref('/status/' + this.authManager.user.id);

        if (!snapshot.val()) {
            return;
        };

        await userStatusDatabaseRef.set({
            state: "online",
            last_changed: this.firebaseService.serverTimestamp
        });

        this.firebaseService.database.ref('/status').on('value', this._onPresence.bind(this));

        userStatusDatabaseRef.onDisconnect().set({
            state: "offline",
            last_changed: this.firebaseService.serverTimestamp
        });
    }

    private async _onPresence(value) {
        const data = value.val();
        delete data[this.authManager.user.id];
        const userIds = Object.keys(data);
        const missingUserIds = [];

        let id;
        for (let i = 0, len = userIds.length; i < len; i++) {
            id = userIds[i];
            if (!this.users[id]) {
                missingUserIds.push(id);
            } else {
                this.users[id].presence = data[id].state;
            }
        }

        const users = await this.usersManager.getAllById(missingUserIds);

        for (let i = 0, len = users.length; i < len; i++) {
            id = users[i].id;
            this.users[id] = { ...users[i], presence: data[id].state };
        }
    }
}