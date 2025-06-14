class AuthService {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    async register(username, password) {
        // Здесь будет логика регистрации
        // API запрос к серверу
        // Имитация проверки существующего пользователя
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.username === username)) {
            throw new Error('Пользователь с таким именем уже существует');
        }

        // сохраняем нового пользователя
        users.push({ username, password});
        localStorage.setItem('users', JSON.stringify(users));

        // Автоматически логиним после регистрации
        return this.login(username, password);
    }

    async login(username, password) {
        // Здесь будет логика авторизации
        // API запрос к серверу 
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            throw new Error('Неверные email или пароль');
        }

        this.isAuthenticated = true;
        this.currentUser = { email: username };
        return this.currentUser;

    }

    logout() {
        // Очистка данных пользователя из локального хранилища
        localStorage.removeItem(`todos_${this.currentUser?.email}`);
        localStorage.removeItem(`archivedTodos_${this.currentUser?.email}`);
        localStorage.removeItem(`categories_${this.currentUser?.email}`);
        
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    checkAuth() {
        return this.isAuthenticated;
    }
}

export const authService = new AuthService();