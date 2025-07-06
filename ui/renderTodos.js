
import { filterAndSortTodos } from '../services/todoService.js';
import { createTodoElement } from '../ui/todoElement.js';
import { addToArchive, getArchivedTodos } from '../services/archiveApiService.js';
import { deleteTodo, updateTodo } from '../services/todoApiService.js';
import { updateStats } from './updateStats.js';
import { showAlert } from './alert.js';

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
            checkbox.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!todo.completed) {
                    try {
                        const archivedTodo = { ...todo, archiveDate: new Date().toISOString() };
                        await addToArchive(archivedTodo);
                        await deleteTodo(todo.id);

                        todos = todos.filter(t => t.id !== todo.id);
                        archivedTodos = await getArchivedTodos();

                        renderTodos(todos, archivedTodos, categories);
                        updateStats(todos, archivedTodos);
                    } catch (error) {
                        console.error('Ошибка при архивации задачи:', error);
                    }
                } else {
                    todo.completed = false;
                    await updateTodo(todo.id, { completed: false });
                    renderTodos(todos, archivedTodos, categories);
                }
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', async () => {
                const isEditing = li.classList.contains('editing');
                if (isEditing) {
                    const input = li.querySelector('.edit-input');
                    if (input && input.value.trim()) {
                        todo.text = input.value.trim();
                        span.textContent = todo.text;
                        input.replaceWith(span);
                        editBtn.innerHTML = '<i class="fas fa-pen"></i>';
                        li.classList.remove('editing');
                        await updateTodo(todo.id, { text: todo.text });
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
            deleteBtn.addEventListener('click', async () => {
                li.classList.add('deleting');
                setTimeout(async () => {
                    try {
                        await deleteTodo(todo.id);
                        todos = todos.filter(t => t.id !== todo.id);
                        renderTodos(todos, archivedTodos, categories);
                        updateStats(todos, archivedTodos);
                    } catch (error) {
                        showAlert('Ошибка при удалении задачи');
                    }
                }, 300);
            });
        }

        todoList.appendChild(li);
    }

    return { todos, archivedTodos };
}
