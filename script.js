document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const prioritySelect = document.getElementById('prioritySelect');
    const filterPriority = document.getElementById('filterPriority');
    const sortBy = document.getElementById('sortBy');

    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    function updateStats() {
        if (totalTasks) {
            totalTasks.textContent = todos.length;
        }
        if (completedTasks) {
            completedTasks.textContent = todos.filter(todo => todo.completed).length;
        }
    }

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

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';

        li.appendChild(checkbox);
        li.appendChild(span);
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

            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    todos[index].completed = !todos[index].completed;
                    li.classList.toggle('completed');
                    saveTodos();
                });
            }

            if(deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    todos.splice(index, 1);
                    renderTodos();
                    saveTodos();
                });
            }
            
            todoList.appendChild(li);
        });
    }

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        const priority = prioritySelect.value;
        if (text) {
            todos.push({ text, completed: false, priority});
            todoInput.value = '';
            renderTodos();
            saveTodos();
        }
    });

    filterPriority.addEventListener('change', renderTodos);
    sortBy.addEventListener('change', renderTodos);
    renderTodos();
    updateStats(); 
});