import { define, singleton } from "@injex/core";
import IUser from "interfaces/IUser";
import FirebaseCollectionManager from "lib/FirebaseCollectionManager";

@define()
@singleton()
export class UsersManager extends FirebaseCollectionManager<IUser> {
    protected get collectionName(): string {
        return "users";
    }
}