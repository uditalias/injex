import clsx from "clsx";
import { observer } from "mobx-react";
import { ChangeEvent, createRef, KeyboardEvent, useCallback, useEffect, useState } from "react";
import { ENTER_KEY, ESCAPE_KEY } from "../common/constants";
import { TodoModel } from "../todos/todoModel";
import useTodosManager from "../todos/useTodosManager";

export type TodoItemProps = {
    item: TodoModel;
}

function TodoItem({ item }: TodoItemProps) {
    const [editText, setEditText] = useState(item.title);
    const todosManager = useTodosManager();
    const inputRef = createRef<HTMLInputElement>();

    const editMode = todosManager.editTodoId === item.id;
    const onToggle = useCallback(() => item.toggle(), []);
    const onDestroy = useCallback(() => todosManager.clear(item), []);
    const onEdit = useCallback(() => {
        setEditText(item.title);
        todosManager.setEditTodoId(item.id);
    }, []);
    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => editMode && setEditText(e.target.value), [editMode]);

    const handleSubmit = useCallback(() => {
        const value = editText.trim();
        if (value) {
            item.updateTitle(value);
            setEditText(value);
            todosManager.setEditTodoId('');
        } else {
            onDestroy();
        }
    }, [editText]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            case ENTER_KEY:
                handleSubmit();
                break;
            case ESCAPE_KEY:
                setEditText(item.title);
                todosManager.setEditTodoId('');
                break;
        }
    }, [editText]);

    useEffect(() => {
        if (editMode) {
            const input = inputRef.current!;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    }, [editMode]);

    return (
        <li className={clsx({
            completed: item.completed,
            editing: editMode
        })}>
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={item.completed}
                    onChange={onToggle}
                />
                <label onDoubleClick={onEdit}>
                    {item.title}
                </label>
                <button className="destroy" onClick={onDestroy} />
            </div>
            <input
                ref={inputRef}
                className="edit"
                value={editText}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                onChange={onChange}
            />
        </li>
    );
}

export default observer(TodoItem);