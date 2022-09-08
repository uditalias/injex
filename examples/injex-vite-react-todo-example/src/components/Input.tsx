import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import { ENTER_KEY } from "../common/constants";
import useTodosManager from "../todos/useTodosManager";

export default function Input() {
    const [newTodo, setNewTodo] = useState('');
    const todosManager = useTodosManager();
    const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setNewTodo(e.currentTarget.value), []);
    const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode !== ENTER_KEY) {
            return;
        }

        e.preventDefault();

        const value = e.currentTarget.value.trim();

        if (value) {
            todosManager.addTodo(value);
            setNewTodo('');
        }
    }, []);

    return (
        <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onKeyDown={onKeyDown}
            onChange={onInputChange}
            autoFocus={true}
        />
    );
}