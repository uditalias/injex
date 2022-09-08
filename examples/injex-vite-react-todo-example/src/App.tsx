import { observer } from "mobx-react";
import { ChangeEvent, useCallback } from "react";
import Footer from "./components/Footer";
import Input from "./components/Input";
import TodoItem from "./components/TodoItem";
import useTodosManager from "./todos/useTodosManager";

function App() {
    const todosManager = useTodosManager();
    const toggleAllTodos = useCallback((e: ChangeEvent<HTMLInputElement>) => todosManager.toggleAll(e.target.checked), []);

    return (
        <div>
            <header className="header">
                <h1>todos</h1>
                <Input />
            </header>
            {todosManager.todos.length ? (
                <section className="main">
                    <input
                        id="toggle-all"
                        className="toggle-all"
                        type="checkbox"
                        onChange={toggleAllTodos}
                        checked={todosManager.activeCount === 0}
                    />
                    <label
                        htmlFor="toggle-all"
                    />
                    <ul className="todo-list">
                        {todosManager.displayTodos.map((item) => (
                            <TodoItem key={item.id} item={item} />
                        ))}
                    </ul>
                </section>
            ) : null}
            {todosManager.activeCount || todosManager.completedCount ? <Footer /> : null}
        </div>
    );
}

export default observer(App);