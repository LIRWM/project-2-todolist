import { authService } from './services/auth.js';
import { archiveTodo, saveArchivedTodos } from './services/archiveService.js';
import { showArchiveModal } from './ui/archiveModal.js';
import { validatePassword } from './utils/validatePassword.js';
import { themeToggle } from './ui/themeToggle.js';
import { updateStats } from './ui/updateStats.js';
import { filterAndSortTodos, saveTodos } from './services/todoService.js';
import { saveCategories } from './services/CategoryService.js';
import { createTodoElement } from './ui/todoElement.js';

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

    const prioritySelect = document.getElementById('prioritySelect');
    const filterPriority = document.getElementById('filterPriority');
    const sortBy = document.getElementById('sortBy');


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
    themeToggle();

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

        //////////////////////
        const errors = validatePassword(password, confirmPassword);
        if (errors.length > 0) {
            alert(errors.join('\n'));
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

    let todos = [];
    let archivedTodos = [];
    let categories = [];

    function initializeData() {
        if (authService.currentUser?.email) {
            const userEmail = authService.currentUser.email;
            try {
                const todosData = localStorage.getItem(`todos_${userEmail}`);
                const archivedData = localStorage.getItem(`archivedTodos_${userEmail}`);
                const categoriesData = localStorage.getItem(`categories_${userEmail}`);

                todos = todosData ? JSON.parse(todosData) : [];
                archivedTodos = archivedData ? JSON.parse(archivedData) : [];
                categories = categoriesData ? JSON.parse(categoriesData) : [];

                renderTodos();
                updateStats(todos, archivedTodos);
                updateCategorySelect();
            } catch (error) {
                console.error('Ошибка при инициализации данных:', error);
                todos = [];
                archivedTodos = [];
                categories = [];
            }
        }
    }

    // Вызываем initializeData только при входе пользователя
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
            initializeData(); // Инициализируем данные после успешной авторизации
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



    const today = new Date().toISOString().split('T')[0];
    dueDateInput.min = today;



    function loadUserData() {
        const userEmail = authService.currentUser?.email;
        if (userEmail) {
            todos = JSON.parse(localStorage.getItem(`todos_${userEmail}`)) || [];
            archivedTodos = JSON.parse(localStorage.getItem(`archivedTodos_${userEmail}`)) || [];
            categories = JSON.parse(localStorage.getItem(`categories_${userEmail}`)) || [];
            renderTodos();
            updateStats(todos, archivedTodos);
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
            saveCategories(categories);
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



    authButton.addEventListener('click', showAuth);



/////////////////////////////////////////
/////////////////////////////////////////

    

    async function archiveCompletedTodos() {
        if (archivedTodos.length === 0) {
            alert('Нет выполненных задач для архивации');
            return;
        }
        const completedTodos = todos.filter(todo => todo.completed);
        try {
            const archivedWithInfo = completedTodos.map(todo => ({
                ...todo,
                archiveDate: new Date().toISOString()
            }));

            archivedTodos = [...archivedTodos, ...archivedWithInfo];
            todos = todos.filter(todo => !todo.completed);

            if (await saveTodos(todos, archivedTodos) && await saveArchivedTodos(todos, archivedTodos)) {
                renderTodos();
                updateStats(todos, archivedTodos);
                showArchiveModal(archivedTodos, categories);
            }
        } catch (error) {
            console.error('Ошибка при архивации:', error);
            alert('Произошла ошибка при архивации задач');
        }
    }

    archiveButton.addEventListener('click', archiveCompletedTodos);

///////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
    

    function renderTodos() {
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
                                renderTodos(result.updatedTodos, result.updatedArchivedTodos);
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
                        renderTodos();
                        saveTodos(todos, archivedTodos);
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
            await saveTodos(todos, archivedTodos);
            renderTodos();
            todoInput.value = '';
            dueDateInput.value = '';
            prioritySelect.value = 'medium';
            categorySelect.value = '';
            updateStats(todos, archivedTodos);
            return false;
        }
    })

 
    filterPriority.addEventListener('change', renderTodos);
    sortBy.addEventListener('change', renderTodos);
    updateCategorySelect();
    renderTodos();
    updateStats(todos, archivedTodos); 
});

