import { updateStats } from '../ui/updateStats.js';
import { saveTodos, filterAndSortTodos } from '../services/todoService.js';
import { createTodoElement } from '../ui/todoElement.js';
import { archiveTodo, saveArchivedTodos } from '../services/archiveService.js';

export function renderTodos(todos, archivedTodos, categories) {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;

    todoList.innerHTML = '';
    const filteredTodos = filterAndSortTodos(todos, filterPriority.value, sortBy.value, categories);
    filteredTodos.forEach((todo, index) => {
        const li = createTodoElement(todo, categories);
        const checkbox = li.querySelector('input[type="checkbox"]');
        const deleteBtn = li.querySelector('.delete-btn');
        const editBtn = li.querySelector('.edit-btn');
        const span = li.querySelector('span');

        if (checkbox) {
            checkbox.addEventListener('change', () => {
                if (!todo.completed) {
                    todo.completed = true;
                    li.classList.add('completed');
                    li.classList.add('fade-out');
                    setTimeout(() => {
                        const result = archiveTodo(todos, archivedTodos, todo, index);
                        saveTodos(todos, archivedTodos);
                        saveArchivedTodos(result.updatedTodos, result.updatedArchivedTodos);
                        renderTodos(result.updatedTodos, result.updatedArchivedTodos, categories);
                        updateStats(result.updatedTodos, result.updatedArchivedTodos);
                    }, 500);
                } else {
                    todo.completed = false;
                    li.classList.remove('completed');
                }
                saveTodos(todos, archivedTodos);
            });
        }

        if (editBtn){
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
                    todos.splice(index, 1);
                    renderTodos(todos, archivedTodos, categories);
                    saveTodos(todos, archivedTodos);
                }, 300);
            });
        }
            
        todoList.appendChild(li);
    });
}