import { authService } from './services/auth.js';
import { showArchiveModal } from './ui/archiveModal.js';
import { validatePassword } from './utils/validatePassword.js';
import { themeToggle } from './ui/themeToggle.js';
import { updateStats } from './ui/updateStats.js';
import { renderTodos } from './ui/renderTodos.js';
import { updateCategorySelect } from './ui/categoryDropdown.js';
import { setupCategoryModal } from './ui/categoryModal.js';
import { showAlert } from './ui/alert.js';
import { getTodos, addTodo, deleteTodo } from './services/todoApiService.js';
import { getArchivedTodos } from './services/archiveApiService.js';
import { getCategories } from './services/categoryApiService.js';

let todos = [];
let archivedTodos = [];
let categories = [];

async function initializeData() {
    if (authService.currentUser?.email) {
        const userEmail = authService.currentUser.email;
        try {
            todos = await getTodos(userEmail);
            archivedTodos = await getArchivedTodos();
            const allCategories = await getCategories();
            categories = allCategories.filter(cat => !cat.userEmail || cat.userEmail === userEmail);

            setupCategoryModal(categories, null, updateCategorySelect);
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

document.addEventListener('DOMContentLoaded', async () => {
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

    if (authService.checkAuth()) {
        await showApp();
    } else {
        mainContainer.classList.add('hidden');
        document.querySelector('.user-info').classList.add('hidden');
        authButton.classList.remove('hidden');
        authContainer.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }

    themeToggle();

    authButton.addEventListener('click', showAuth);

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
            showAlert('Ошибка при регистрации!', 'error');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await authService.login(email, password);
            await showApp();
        } catch (error) {
            showAlert('Ошибка при авторизации!', 'error');
        }
    });

    logoutButton.addEventListener('click', () => {
        authService.logout();
        mainContainer.classList.add('hidden');
        document.querySelector('.user-info').classList.add('hidden');
        authButton.classList.remove('hidden');
        authContainer.classList.remove('hidden');
        todoForm.style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.querySelector('.todo-stats').style.display = 'none';
        todos = [];
        archivedTodos = [];
        categories = [];
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

    async function showApp() {
        const blurredBg = document.getElementById('blurredBg');
        authContainer.classList.add('hidden');
        blurredBg.classList.add('hidden');
        mainContainer.classList.remove('hidden', 'blur');

        if (authService.currentUser) {
            userEmailSpan.textContent = authService.currentUser.email;
            document.querySelector('.user-info').classList.remove('hidden');
            todoForm.style.display = 'flex';
            document.querySelector('.controls').style.display = 'flex';
            document.querySelector('.todo-stats').style.display = 'block';
            authButton.classList.add('hidden');
            await initializeData();
        }
    }

    archiveButton.addEventListener('click', async () => {
        const completedTodos = todos.filter(todo => todo.completed);
        if (archivedTodos.length === 0) {
            showAlert('Нет выполненных задач для архивации', 'error');
            return;
        }
        try {
            await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
            todos = todos.filter(todo => !todo.completed);
            archivedTodos = await getArchivedTodos();

            renderTodos(todos, archivedTodos, categories);
            updateStats(todos, archivedTodos);
            showArchiveModal(categories);
        } catch (error) {
            console.error('Ошибка при архивации:', error);
            showAlert('Произошла ошибка при архивации задач', 'error');
        }
    });

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
                userEmail: authService.currentUser.email
            };
            try {
                const createdTodo = await addTodo(todo);
                todos.push(createdTodo);
            } catch (error) {
                console.error('Ошибка при добавлении задачи:', error);
                showAlert('Не удалось сохранить задачу на сервере.', 'error');
                todos.push(todo);
            }
            renderTodos(todos, archivedTodos, categories);
            todoInput.value = '';
            dueDateInput.value = '';
            prioritySelect.value = 'medium';
            categorySelect.value = '';
            updateStats(todos, archivedTodos);
        }
    });

    filterPriority.addEventListener('change', () => {
        renderTodos(todos, archivedTodos, categories);
    });

    sortBy.addEventListener('change', () => {
        renderTodos(todos, archivedTodos, categories);
    });
});