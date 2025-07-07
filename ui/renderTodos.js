import { updateStats } from '../ui/updateStats.js';
import { filterAndSortTodos } from '../services/todoService.js';
import { createTodoElement } from '../ui/todoElement.js';
import { addToArchive, getArchivedTodos } from '../services/archiveApiService.js';
import { deleteTodo, updateTodo } from '../services/todoApiService.js';
import { showAlert } from '../ui/alert.js';

export async function renderTodos(todos, archivedTodos, categories) {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;

    todoList.innerHTML = '';

    const filteredTodos = filterAndSortTodos(todos, filterPriority.value, sortBy.value, categories);

    for (let index = 0; index < filteredTodos.length; index++) {
        const todo = filteredTodos[index];
        const li = createTodoElement(todo, categories);
        const checkbox = li.querySelector('input[type="checkbox"]');
        const deleteBtn = li.querySelector('.delete-btn');
        const editBtn = li.querySelector('.edit-btn');
        const span = li.querySelector('span');

        if (checkbox) {
            checkbox.addEventListener('change', async (e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                if (!todo.completed) {
                    // Mark as completed and archive after a short delay
                    todo.completed = true;
                    li.classList.add('completed');
                    li.classList.add('fade-out');

                    setTimeout(async () => {
                        try {
                            const archivedTodo = {
                                ...todo,
                                archiveDate: new Date().toISOString()
                            };
                            // Add to archive on server and remove from active todos
                            await addToArchive(archivedTodo);
                            await deleteTodo(todo.id);
                            todos = todos.filter(t => t.id !== todo.id);
                            // Refresh archived list from server
                            archivedTodos = await getArchivedTodos();
                            // Re-render list and update stats
                            renderTodos(todos, archivedTodos, categories);
                            updateStats(todos, archivedTodos);
                        } catch (error) {
                            console.error('Ошибка при архивации задачи:', error);
                        }
                    }, 500);
                } else {
                    // Un-mark as completed (restore to active)
                    todo.completed = false;
                    li.classList.remove('completed');
                    try {
                        await updateTodo(todo.id, { completed: false });
                    } catch (error) {
                        console.error('Ошибка при обновлении задачи:', error);
                    }
                    updateStats(todos, archivedTodos);
                }
                return false;
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const isEditing = li.classList.contains('editing');
                if (isEditing) {
                    const input = li.querySelector('.edit-input');
                    if (input && input.value.trim()) {
                        // Save edited text
                        todo.text = input.value.trim();
                        span.textContent = todo.text;
                        input.replaceWith(span);
                        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
                        li.classList.remove('editing');
                        try {
                            updateTodo(todo.id, { text: todo.text });
                        } catch (error) {
                            console.error('Ошибка при обновлении задачи:', error);
                            showAlert('Не удалось сохранить изменения задачи на сервере.', 'error');
                        }
                        updateStats(todos, archivedTodos);
                    }
                } else {
                    // Enter edit mode
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'edit-input';
                    input.value = todo.text;
                    span.replaceWith(input);
                    input.focus();
                    editBtn.innerHTML = '<i class="fas fa-check"></i>';
                    li.classList.add('editing');
                }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                li.classList.add('deleting');
                setTimeout(async () => {
                    try {
                        await deleteTodo(todo.id);
                    } catch (error) {
                        console.error('Ошибка при удалении задачи:', error);
                        showAlert('Ошибка при удалении задачи.', 'error');
                    }
                    todos = todos.filter(t => t.id !== todo.id);
                    renderTodos(todos, archivedTodos, categories);
                    updateStats(todos, archivedTodos);
                }, 300);
            });
        }

        todoList.appendChild(li);
    }

    return { todos, archivedTodos };
}