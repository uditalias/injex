import { define } from "@injex/core";
import { makeObservable, observable } from "mobx";

export interface ITodoModelDelegate {
    todo_didUpdate(todo: TodoModel): void;
}

@define()
export class TodoModel {
    @observable public id: string;
    @observable public title: string;
    @observable public completed: boolean;

    public delegate: ITodoModelDelegate;

    constructor(args: { id: string, title: string, completed: boolean }) {
        makeObservable(this);
        this.id = args.id;
        this.title = args.title;
        this.completed = args.completed;
    }

    public toggle(completed?: boolean) {
        if (typeof completed === 'boolean') {
            this.completed = completed;
        } else {
            this.completed = !this.completed;
        }

        this._update();
    }

    public updateTitle(title: string) {
        this.title = title;
        this._update();
    }

    private _update() {
        this.delegate.todo_didUpdate(this);
    }
}