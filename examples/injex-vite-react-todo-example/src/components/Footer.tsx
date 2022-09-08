import { useCallback } from "react";
import { pluralize } from "../common/utils";
import useTodosManager from "../todos/useTodosManager";
import clsx from "clsx";
import { TodoFilter } from "../common/types";
import { observer } from "mobx-react";

function Footer() {
    const todosManager = useTodosManager();
    const activeTodoWord = pluralize(todosManager.activeCount, 'item');
    const onClearCompleted = useCallback(() => todosManager.clearCompleted(), []);

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{todosManager.activeCount}</strong> {activeTodoWord} left
            </span>
            <ul className="filters">
                <li>
                    <a
                        href="#"
                        className={clsx({ selected: todosManager.filter === TodoFilter.All })}>
                        All
                    </a>
                </li>
                <li>
                    <a
                        href="#active"
                        className={clsx({ selected: todosManager.filter === TodoFilter.Active })}>
                        Active
                    </a>
                </li>
                <li>
                    <a
                        href="#completed"
                        className={clsx({ selected: todosManager.filter === TodoFilter.Completed })}>
                        Completed
                    </a>
                </li>
            </ul>
            {todosManager.completedCount > 0 ? (
                <button className="clear-completed" onClick={onClearCompleted}>Clear completed</button>
            ) : null}
        </footer>
    );
}

export default observer(Footer);