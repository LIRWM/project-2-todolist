    import { authService } from '../services/auth.js';

    export function updateStats(todos, archivedTodos) {
        const totalTasks = document.getElementById('totalTasks');
        const completedTasks = document.getElementById('completedTasks');
        const progressFill = document.getElementById('progressFill');
        if (!authService.currentUser?.email) return;

        const activeTasks = todos.length;
        const completedTasksCount = archivedTodos.length; // Используем длину архива
        const totalTasksCount = activeTasks + completedTasksCount;

        if (totalTasks) {
            totalTasks.textContent = totalTasksCount;
        }
        if (completedTasks) {
            completedTasks.textContent = completedTasksCount;
            if (progressFill) {
                const percentage = totalTasksCount > 0 ? 
                    (completedTasksCount / totalTasksCount) * 100 : 0;
                progressFill.style.width = `${percentage}%`;
            }
        }
    }