import { authService } from '../services/auth.js';
import { updateStats } from '../ui/updateStats.js';

export function saveArchivedTodos(todos, archivedTodos) {
    const userEmail = authService.currentUser?.email;
    if (!userEmail) return false;

    try {
        localStorage.setItem(`archivedTodos_${userEmail}`, JSON.stringify(archivedTodos));
        updateStats(todos, archivedTodos);
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении архива:', error);
        return false;
    }
}

export function archiveTodo(todos, archivedTodos, todo, index) {
    const todoToArchive = {
        ...todo,
        archiveDate: new Date().toISOString()
    };
    archivedTodos.push(todoToArchive);
    todos.splice(index, 1);

    return {
        updatedTodos: todos,
        updatedArchivedTodos: archivedTodos
    };
}