document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    
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
        li.className = 'todo-item';
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

    function renderTodos() {
        if (!todoList) return;

        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
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
        if (text) {
            todos.push({ text, completed: false});
            todoInput.value = '';
            renderTodos();
            saveTodos();
        }
    });

    renderTodos();
    updateStats(); 
});