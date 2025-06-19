import { authService } from './services/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const userEmailSpan = document.getElementById('userEmail');
    const logoutButton = document.getElementById('logoutButton');
    const authButton = document.getElementById('authButton');
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
    const themeToggle = document.getElementById('themeToggle');
    const categorySelect = document.getElementById('categorySelect');
    const addCategoryButton = document.getElementById('addCategoryButton');
    const archiveButton = document.getElementById('archiveButton');
    const authContainer = document.getElementById('authContainer');
    const mainContainer = document.getElementById('mainContainer');

    if (!authService.checkAuth()) {
        mainContainer.classList.add("hidden");
        document.querySelector('.user-info').classList.add("hidden");
        authButton.classList.remove("hidden");
        authContainer.classList.remove("hidden");
        registerForm.classList.add("hidden")
    } else {
        authContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        document.querySelector('.user-info').classList.remove("hidden");
        authButton.classList.add("hidden");
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            userEmailSpan.textContent = currentUser.email;
        }
    }
    let isDarkTheme = localStorage.getItem('theme') === 'dark';
    if (isDarkTheme) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
        themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
        localStorage.setItem('theme', isDarkTheme? 'dark' : 'light');
    });

    authButton.addEventListener('click', () => {
        showAuth();
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            await authService.register(email, password);
            showApp();
        } catch (error) {
            alert(error.message);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await authService.login(email, password);
            showApp();
            mainContainer.classList.remove('hidden');
        } catch(error) {
            alert(error.message);
        }
    });

    logoutButton.addEventListener('click', async () => {
        authService.logout();
        mainContainer.classList.add('hidden');
        document.querySelector('.user-info').classList.add('hidden');
        authButton.classList.remove('hidden');
        authContainer.classList.remove('hidden');
        todoForm.style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.querySelector('.todo-stats').style.display = 'none';
        showAuth();
    });

    function showAuth() {
        const blurredBg = document.getElementById('blurredBg');
        authContainer.classList.remove('hidden');
        blurredBg.classList.remove('hidden');
        mainContainer.classList.add('blur');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authButton.classList.add('hidden');
    }

    function showApp() {
        const blurredBg = document.getElementById('blurredBg');
        authContainer.classList.add('hidden');
        blurredBg.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        mainContainer.classList.remove('blur');
        
        if (authService.currentUser) {
            userEmailSpan.textContent = authService.currentUser.email;
            document.querySelector('.user-info').classList.remove('hidden');
            todoForm.style.display = 'flex';
            document.querySelector('.controls').style.display = 'flex';
            document.querySelector('.todo-stats').style.display = 'block';
            authButton.classList.add('hidden');
        } else {
            document.querySelector('.user-info').classList.add('hidden');
            todoForm.style.display = 'none';
            document.querySelector('.controls').style.display = 'none';
            document.querySelector('.todo-stats').style.display = 'none';
            authButton.classList.remove('hidden');
        }
    }

    if (authService.checkAuth()) {
        showApp();
    } else {
        // Скрываем элементы управления
        todoForm.style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.querySelector('.todo-stats').style.display = 'none';
        document.querySelector('.user-controls').style.display = 'none';
    }



    let todos = [];
    let archivedTodos = [];
    let categories = [];
    
    if (authService.currentUser) {
        const userEmail = authService.currentUser.email;
        todos = JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || [];
        archivedTodos = JSON.parse(localStorage.getItem(`archivedTodos_${userEmail}`)) || [];
        categories = JSON.parse(localStorage.getItem(`categories_${userEmail}`)) || [];
    }

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

    async function saveTodos() {
        const userEmail = authService.currentUser?.email;
        if (userEmail) {
            try {
                localStorage.setItem(`todos_${userEmail}`, JSON.stringify(todos));
                updateStats();
                return true;
            } catch (error) {
                console.error('Ошибка при сохранении задач:', error);
                return false;
            }
        }
        return false;
    }
    
    function saveArchivedTodos() {
        const userEmail = authService.currentUser?.email;
        if (userEmail) {
            localStorage.setItem(`archivedTodos_${userEmail}`, JSON.stringify(archivedTodos));
        }
    }
    
    function saveCategories() {
        const userEmail = authService.currentUser?.email;
        if (userEmail) {
            localStorage.setItem(`categories_${userEmail}`, JSON.stringify(categories));
        }
    }

    function loadUserData() {
        const userEmail = authService.currentUser?.email;
        if (userEmail) {
            todos = JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || [];
            archivedTodos = JSON.parse(localStorage.getItem(`archivedTodos_${userEmail}`)) || [];
            categories = JSON.parse(localStorage.getItem(`categories_${userEmail}`)) || [];
            renderTodos();
            updateStats();
            updateCategorySelect();
        }
    }



    addCategoryButton.addEventListener('click', () => {
        const categoryName = prompt('Введите название категории:');
        if (categoryName && categoryName.trim()) {
            const newCategory = {
                id: Date.now().toString(),
                name: categoryName.trim()
            };
            categories.push(newCategory);
            saveCategories();
            updateCategorySelect();
        }
    });

    function updateCategorySelect() {
        categorySelect.innerHTML = '<option value="">Без категории</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkTheme = savedTheme === 'dark';
        document.body.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        const theme = isDarkTheme ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
        localStorage.setItem('theme', isDarkTheme? 'dark' : 'light');
    });

    authButton.addEventListener('click', showAuth);

    function createTodoElement(todo) {
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
        categorySpan.textContent = category ? category.name : '';

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
        // добавил иконку вместо текста
        const img = document.createElement('img');
        img.src = "edit.svg";
        img.alt = 'Изменить';
        img.className = 'edit-icon';
        
        editBtn.appendChild(img);


        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(categorySpan);
        li.appendChild(dueDate);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
 

        return li;
    }

    function showArchiveModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const archiveContainer = document.createElement('div');
        archiveContainer.className = 'archive-container'; 

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'x';
        closeBtn.className = 'close-btn';
        closeBtn.onclick = () => document.body.removeChild(modal);

        const title = document.createElement('h2');
        title.textContent = 'Архив задач';

        const archiveList = document.createElement('div');
        archiveList.className = 'archive-list';

       archivedTodos.forEach((todo, index) => {
            const archiveItem = document.createElement('div');
            archiveItem.className = 'archive-item';
        
            const number = document.createElement('span');
            number.className = 'archive-number';
            number.textContent = `${index + 1}. `;

            const text = document.createElement('span');
            text.textContent = todo.text;

            const category = document.createElement('span');
            category.className = 'todo-category';
            category.textContent = todo.category || '';

            const note = document.createElement('div');
            note.className = 'archive-note';
            note.textContent = todo.archiveNote || '';

            const date = document.createElement('span');
            date.className = 'archive-date';
            if (todo.archiveDate) { 
                const archiveDate = new Date(todo.archiveDate);
                if (!isNaN(archiveDate.getTime())) { 
                date.textContent = archiveDate.toLocaleDateString();
                }
            }

            archiveItem.appendChild(number);
            archiveItem.appendChild(text);
            if (todo.category) archiveItem.appendChild(category);
            if (todo.archiveNote) archiveItem.appendChild(note);
            archiveItem.appendChild(date);
            archiveList.appendChild(archiveItem);
        });

        archiveContainer.appendChild(closeBtn);
        archiveContainer.appendChild(title);
        archiveContainer.appendChild(archiveList);
        modal.appendChild(archiveContainer);
        document.body.appendChild(modal);
    }

    archiveButton.addEventListener('click', () => {
        const completedTodos = todos.filter(todo => todo.completed);
        if (completedTodos.length > 0) {
            const archivedWithNotes = completedTodos.map(todo => ({
                ...todo,
                archiveDate: new Date().toISOString()
            }));
            archivedTodos = [...archivedTodos, ...archivedWithNotes];
            todos = todos.filter(todo => !todo.completed);
            saveArchivedTodos();
            saveTodos();
            renderTodos();
            showArchiveModal();
        } else {
            alert('Нет выполненных задач для архивации');
        }
    });

    function archiveTodo(todo, index) {
        const note = prompt('Добавьте заметку о выполнении (необязательно):');
        const todoToArchive = { ...todo, archiveNote: note, archiveDate: new Date().toISOString() };

        archivedTodos.push(todoToArchive);
        todos.splice(index, 1);
        
        saveArchivedTodos();
        saveTodos();
        renderTodos();
    }

    function filterAndSortTodos() {
        let filteredTodos = [...todos];

        if (filterPriority.value !== 'all') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === filterPriority.value);
        }

        switch(sortBy.value) {
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
            case 'category':
                filteredTodos.sort((a, b) => {
                    if (!a.category && !b.category) return 0;
                    if (!a.category) return 1;
                    if (!b.category) return -1;
                    return a.category.localeCompare(b.category);
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
                    const todo = todos[index];
                    if (!todo.completed) {
                        todo.completed = true;
                        li.classList.add('completed');
                        li.classList.add('fade-out');
                        setTimeout(() => {
                            archiveTodo(todo, index);
                        }, 500);
                    } else {
                        todo.completed = false;
                        li.classList.remove('completed');
                    }
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

    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;
        const categoryId = categorySelect.value;

        if (todoText && authService.currentUser) {
            const todo = {
                id: Date.now().toString(),
                text: todoText,
                completed: false,
                dueDate: dueDate || null,
                priority,
                categoryId: categoryId || null,
                userEmail: authService.currentUser?.email
            };

            todos.push(todo);
            await saveTodos();
            renderTodos();
            todoInput.value = '';
            dueDateInput.value = '';
            prioritySelect.value = 'medium';
            categorySelect.value = '';
            updateStats();
            return false;
        }
    });

    filterPriority.addEventListener('change', renderTodos);
    sortBy.addEventListener('change', renderTodos);
    updateCategorySelect();
    renderTodos();
    updateStats(); 
});

authService.addAuthStateListener((isAuthenticated) => {
    if (authService.currentUser && isAuthenticated) {
        loadUserData();
    } else {
        todos = [];
        archivedTodos = [];
        categories = [];
        updateTodoList();
        updateStats();
        updateCategorySelect();
    }
});