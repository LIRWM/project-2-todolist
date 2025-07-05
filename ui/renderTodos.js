import { updateStats } from '../ui/updateStats.js';
import { saveTodos, filterAndSortTodos } from '../services/todoService.js';
import { createTodoElement } from '../ui/todoElement.js';
import { addToArchive, getArchivedTodos } from '../services/archiveApiService.js';

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
            checkbox.addEventListener('change', async () => {
                if (!todo.completed) {
                    todo.completed = true;
                    li.classList.add('completed');
                    li.classList.add('fade-out');

                    setTimeout(async () => {
                        try {
                            const archivedTodo = {
                                ...todo,
                                archiveDate: new Date().toISOString()
                            };

                            await addToArchive(archivedTodo);
                            todos = todos.filter(t => t.id !== todo.id);

                            archivedTodos = await getArchivedTodos();
                            await saveTodos(todos, archivedTodos);

                            const result = await renderTodos(todos, archivedTodos, categories);
                            todos = result.todos;
                            archivedTodos = result.archivedTodos;
                            updateStats(todos, archivedTodos);
                        } catch (error) {
                            console.error('Ошибка при архивации задачи:', error);
                        }
                    }, 500);
                } else {
                    todo.completed = false;
                    li.classList.remove('completed');
                    await saveTodos(todos, archivedTodos);
                }
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const isEditing = li.classList.contains('editing');
                if (isEditing) {
                    const input = li.querySelector('.edit-input');
                    if (input && input.value.trim()) {
                        todo.text = input.value.trim();
                        span.textContent = todo.text;
                        input.replaceWith(span);
                        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
                        li.classList.remove('editing');
                        saveTodos(todos, archivedTodos);
                    }
                } else {
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
                setTimeout(() => {
                    todos = todos.filter(t => t.id !== todo.id);
                    renderTodos(todos, archivedTodos, categories);
                    saveTodos(todos, archivedTodos);
                }, 300);
            });
        }

        todoList.appendChild(li);
    }

    return { todos, archivedTodos };
}
