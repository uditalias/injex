import { define, Factory, init, inject, singleton } from "@injex/core";
import { computed, makeObservable, observable } from "mobx";
import { TodoFilter } from "../common/types";
import { guid } from "../common/utils";
import { StorageService } from "../services/storageService";
import { ITodoModelDelegate, TodoModel } from "./todoModel";

@define('todosManager')
@singleton()
export class TodosManager implements ITodoModelDelegate {

    @inject() private storageService: StorageService;
    @inject(TodoModel) private createTodoModel: Factory<TodoModel>;

    private _flushTimer: number;

    @observable public todos: TodoModel[];
    @observable public filter: TodoFilter;
    @observable public editTodoId: string;

    constructor() {
        makeObservable(this);
        this.filter = TodoFilter.All;
        this.todos = [];

        window.addEventListener('hashchange', this._handleHashChange.bind(this));

        this._handleHashChange();
    }

    @init()
    protected initialize() {
        this.todos = this.storageService.getTodos().map(({ id, title, completed }) => {
            return this._createDelegatedTodoModelWithParams(id, title, completed);
        });
    }

    private _createDelegatedTodoModelWithParams(id: string, title: string, completed: boolean): TodoModel {
        const model = this.createTodoModel({ id, title, completed });
        model.delegate = this;
        return model;
    }

    private _flush() {
        window.clearTimeout(this._flushTimer);

        this._flushTimer = window.setTimeout(() => {
            this.storageService.saveTodos(this.todos.map(({ id, title, completed }) => ({ id, title, completed })));
        });
    }

    public todo_didUpdate(_todo: TodoModel): void {
        this._flush();
    }

    private _handleHashChange() {
        const currentHash: any = window.location.hash.replace(/#/, '');
        this.filter = [TodoFilter.Active, TodoFilter.Completed].includes(currentHash) ? currentHash : TodoFilter.All;
    }

    public setEditTodoId(todoId: string) {
        this.editTodoId = this.editTodoId === todoId ? '' : todoId;
    }

    public addTodo(value: string) {
        const model = this._createDelegatedTodoModelWithParams(guid(), value, false);

        this.todos.push(model);

        this._flush();
    }

    public toggleAll(completed: boolean) {
        this.todos.forEach((item) => item.toggle(completed));
        this._flush();
    }

    public clearCompleted() {
        this.todos = this.todos.filter((item) => !item.completed);
        this._flush();
    }

    public clear(todo: TodoModel) {
        this.todos = this.todos.filter((item) => item !== todo);
        this._flush();
    }

    @computed
    public get displayTodos(): TodoModel[] {
        return this.todos.filter((item) => {
            switch (this.filter) {
                case TodoFilter.All: return true;
                case TodoFilter.Active: return !item.completed;
                case TodoFilter.Completed: return item.completed;
            }
        });
    }

    @computed
    public get activeCount(): number {
        return this.todos.filter((item) => !item.completed).length;
    }

    @computed
    public get completedCount(): number {
        return this.todos.length - this.activeCount;
    }
}