import { useInjex } from "@injex/react-plugin";
import { TodosManager } from "./todosManager";

export default function useTodosManager(): TodosManager {
    const [inject] = useInjex();
    return inject<TodosManager>('todosManager');
}