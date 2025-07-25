import { authService } from './services/auth.js';
import { saveArchivedTodos } from './services/archiveService.js';
import { showArchiveModal } from './ui/archiveModal.js';
import { validatePassword } from './utils/validatePassword.js';
import { themeToggle } from './ui/themeToggle.js';
import { updateStats } from './ui/updateStats.js';
import { saveTodos } from './services/todoService.js';
import { saveCategories, loadCategories } from './services/CategoryService.js';
import { renderTodos } from './ui/renderTodos.js';
import { updateCategorySelect } from './ui/categoryDropdown.js';
import { setupCategoryModal } from './ui/categoryModal.js';
import { showAlert } from './ui/alert.js';


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
    const prioritySelect = document.getElementById('prioritySelect');
    const filterPriority = document.getElementById('filterPriority');
    const sortBy = document.getElementById('sortBy');
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

        const errors = validatePassword(password, confirmPassword);
        if (errors.length > 0) {
            showAlert(errors.join('\n'));
            return;
        }
        try {
            await authService.register(email, password);
            showApp();
        } catch (error) {
            showAlert('error', 'Ошибка при авторизации!');
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
            showAlert('Ошибка при авторизации!', 'error');
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

                todos = todosData ? JSON.parse(todosData) : [];
                archivedTodos = archivedData ? JSON.parse(archivedData) : [];
                categories = loadCategories();

                setupCategoryModal(categories, saveCategories, updateCategorySelect);
                renderTodos(todos, archivedTodos, categories);
                updateStats(todos, archivedTodos);
                updateCategorySelect(categories);
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
    }

    const today = new Date().toISOString().split('T')[0];
    dueDateInput.min = today;

    

    authButton.addEventListener('click', showAuth);

    async function archiveCompletedTodos() {
        if (archivedTodos.length === 0) {
            showAlert('Нет выполненных задач для архивации', 'error');
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
                renderTodos(todos, archivedTodos, categories);
                updateStats(todos, archivedTodos);
                showArchiveModal(archivedTodos, categories);
            }
        } catch (error) {
            console.error('Ошибка при архивации:', error);
            showAlert('Произошла ошибка при архивации задач', 'error');
        }
    }

    archiveButton.addEventListener('click', archiveCompletedTodos);

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
            renderTodos(todos, archivedTodos, categories);
            todoInput.value = '';
            dueDateInput.value = '';
            prioritySelect.value = 'medium';
            categorySelect.value = '';
            updateStats(todos, archivedTodos);
            return false;
        }
    })

    filterPriority.addEventListener('change', () => renderTodos(todos, archivedTodos, categories));
    sortBy.addEventListener('change', () => renderTodos(todos, archivedTodos, categories));
    updateCategorySelect(categories);
    renderTodos(todos, archivedTodos, categories);
    updateStats(todos, archivedTodos); 
});