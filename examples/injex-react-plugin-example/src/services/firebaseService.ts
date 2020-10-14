import { define, init, inject, singleton } from "@injex/core";
import IEnvironment from "interfaces/IEnvironment";

@define()
@singleton()
export class FirebaseService {

    @inject() private env: IEnvironment;

    private app;
    public auth;
    public database;

    public get serverTimestamp() {
        return window.firebase.database.ServerValue.TIMESTAMP;
    }

    @init()
    protected async initialize() {
        const config = {
            apiKey: this.env.apiKey,
            authDomain: "injex-chat-app.firebaseapp.com",
            databaseURL: "https://injex-chat-app.firebaseio.com",
            projectId: "injex-chat-app",
            storageBucket: "injex-chat-app.appspot.com",
            messagingSenderId: this.env.messagingSenderId,
            appId: this.env.appId
        };

        this.app = window.firebase.initializeApp(config);
        this.auth = this.app.auth();
        this.database = this.app.database();
    }
}