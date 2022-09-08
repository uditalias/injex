import { define, singleton } from "@injex/core";
import { TODOS_STORAGE_KEY } from "../common/constants";


@define('storageService')
@singleton()
export class StorageService {

    public saveTodos(todos: any[]) {
        window.localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    }

    public getTodos(): any[] {
        try {
            return JSON.parse(window.localStorage.getItem(TODOS_STORAGE_KEY)!) || [];
        } catch (e) {
            return [];
        }
    }
}