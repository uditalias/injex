import { define, singleton, inject } from "@injex/core";
import { Injex } from "@injex/webpack";
import IUser from "interfaces/IUser";
import { observable } from "mobx";
import { FirebaseService } from "../services/firebaseService";
import { PresenceManager } from "./presenceManager";
import { UsersManager } from "./usersManager";

@define()
@singleton()
export class AuthManager {

    @inject() private firebaseService: FirebaseService;
    @inject() private usersManager: UsersManager;
    @inject() private presenceManager: PresenceManager;
    @inject() private $injex: Injex;

    @observable public isLoading: boolean;
    @observable public isLoggedIn: boolean;
    @observable public isLoginRedirect: boolean;
    @observable public user: IUser;

    constructor() {
        this.isLoading = false;
        this.isLoggedIn = false;
        this.isLoginRedirect = false;
        this.user = null;
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    public async initialize() {
        this.isLoading = true;

        try {
            await this.firebaseService.auth.getRedirectResult();

            const uid = this.firebaseService.auth.getUid();

            if (uid) {
                this.user = await this.usersManager.getById(uid);

                if (!this.user) {
                    const currentUser = this.firebaseService.auth.currentUser;

                    this.user = await this.usersManager.create({
                        id: uid,
                        name: currentUser.displayName,
                        email: currentUser.email,
                        created: Date.now()
                    });
                }

                this.presenceManager.initialize();

                this.isLoggedIn = true;
            }
        } catch (e) {
            this.$injex.logger.error("failed to authenticate", e);
        }

        this.isLoading = false;
    }

    public login() {
        this.isLoginRedirect = true;

        this.firebaseService.auth.signInWithRedirect(
            new window.firebase.auth.GoogleAuthProvider()
        );
    }

    public async logout() {
        await this.firebaseService.auth.signOut();

        window.location.reload();
    }
}