import { define, singleton } from "@injex/core";

@define()
@singleton()
export class Store {

    private _id: string;

    public set Id(id: string) {
        this._id = id
    }

    public get Id(): string {
        return this._id;
    }
}