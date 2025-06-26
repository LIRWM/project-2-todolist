export function createTodoElement(todo, categories) {
    const li = document.createElement('li');
    li.className = `todo-item priority-${todo.priority}`;
    if (todo.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;

    const span = document.createElement('span');
    span.textContent = todo.text;
        
    const categorySpan = document.createElement('span');
    categorySpan.className = 'todo-category';
    const category = categories.find(cat => cat.id === todo.categoryId);
    categorySpan.textContent = category ? category.name : 'Без категории';

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
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(categorySpan);
    li.appendChild(dueDate);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
}