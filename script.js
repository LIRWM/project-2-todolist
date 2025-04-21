document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const todoList = document.getElementById('todoList');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const prioritySelect = document.getElementById('prioritySelect');
    const filterPriority = document.getElementById('filterPriority');
    const sortBy = document.getElementById('sortBy');
    const progressFill = document.getElementById('progressFill');

    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    function updateStats() {
        if (totalTasks) {
            totalTasks.textContent = todos.length;
        }
        if (completedTasks) {
            const completed  = todos.filter(todo => todo.completed).length;
            completedTasks.textContent = completed;
            if (progressFill) {
                const percentage = todos.length > 0 ? (completed/todos.length) * 100 : 0;
                progressFill.style.width = `${percentage}%`;
            }
        }
    }

    const today = new Date().toISOString().split('T')[0];
    dueDateInput.min = today;

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateStats();
    }

    function createTodoElement(todo) {
        const li  = document.createElement('li');
        li.className = `todo-item priority-${todo.priority}`;
        if (todo.completed) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        const span = document.createElement('span');
        span.textContent = todo.text;
        
        const dueDate = document.createElement('span')
        dueDate.className = 'due-date';
        if (todo.dueDate) {
            dueDate.textContent = new Date(todo.dueDate).toLocaleDateString();
            if (new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0)) {
                dueDate.classList.add('overdue');
            }
        }

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Изменить';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(dueDate);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
 

        return li;
    }

    function filterAndSortTodos() {
        let filteredTodos = [...todos];

        if (filterPriority.value !== 'all') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === filterPriority.value);
        }

        switch(sortBy.value){
            case 'priority':
                const priorityOrder = {high: 1, medium: 2, low: 3};
                filteredTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'name':
                filteredTodos.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'dueDate':
                filteredTodos.sort((a, b) => {
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break; 
            }
            return filteredTodos;
    }
        function renderTodos() {
        if (!todoList) return;

        todoList.innerHTML = '';
        const filteredTodos = filterAndSortTodos();
        filteredTodos.forEach((todo, index) => {
            const li = createTodoElement(todo);
            const checkbox = li.querySelector('input[type="checkbox"]');
            const deleteBtn = li.querySelector('.delete-btn');
            const editBtn = li.querySelector('.edit-btn');
            const span = li.querySelector('span');

            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    todos[index].completed = !todos[index].completed;
                    li.classList.toggle('completed');
                    saveTodos();
                });
            }

            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    const isEditing = li.querySelector('.edit-input');
                    const saveChanges = () => {
                        const input = li.querySelector('.edit-input');
                        const dateInput = li.querySelector('.edit-date')
                        if (!input) return;

                        const newText = input.value.trim();
                        const newDate = dateInput ? dateInput.value : todo.dueDate;

                        if (newText) {
                            todo.text = newText;
                            todo.dueDate = newDate;
                            span.textContent = newText;
                            const dueDateElement = li.querySelector('.due-date');
                            if (dueDateElement) {
                                dueDateElement.style.display = '';
                                if (newDate) {
                                    dueDateElement.textContent = new Date(newDate).toLocaleDateString();
                                    dueDateElement.classList.toggle('overdue', new Date(newDate) < new Date().setHours(0, 0, 0, 0));
                                } else {
                                    dueDateElement.textContent = '';
                                    dueDateElement.classList.remove('overdue');
                                }
                            }
                            span.classList.add('saved');
                            setTimeout(() => span.classList.remove('saved'), 600);
                            saveTodos();
                        }
                        input.remove();
                        dateInput?.remove();
                        span.style.display = '';
                        editBtn.textContent = 'Изменить';
                        editBtn.classList.remove('saving');
                    };

                    if (!isEditing) {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'edit-input';
                        input.value = todo.text;

                        const dateInput = document.createElement('input');
                        dateInput.type = 'date';
                        dateInput.className = 'edit-date';
                        dateInput.value = todo.dueDate || '';
                        dateInput.min = today;


                        span.style.display = 'none';
                        const dueDate = li.querySelector('.due-date');
                        if (dueDate) dueDate.style.display = 'none';

  
                        li.insertBefore(input, editBtn);                   
                        li.insertBefore(dateInput, editBtn);   
                        input.focus();
                        editBtn.textContent = 'Сохранить';
                        editBtn.classList.add('saving');

                        input.addEventListener('keypress', (e) => {
                            if (e.key === "Enter") {
                                saveChanges();
                            }
                        });
                        dateInput.addEventListener('keypress', (e) => {
                            if (e.key === "Enter") {
                                saveChanges();
                            }
                        });
                    } else {
                        saveChanges();
                    }
                });
            }    

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    li.classList.add('deleting');
                    setTimeout(() => { 
                        todos.splice(index, 1);
                        renderTodos();
                        saveTodos();
                    }, 300);
                });
            }
            
            todoList.appendChild(li);
        });
    }

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value;

        if (text) {
            todos.push({ text, completed: false, priority, dueDate: dueDate || null});
            todoInput.value = '';
            dueDateInput.value = '';
            renderTodos();
            saveTodos();
        }
    });

    filterPriority.addEventListener('change', renderTodos);
    sortBy.addEventListener('change', renderTodos);
    renderTodos();
    updateStats(); 
});