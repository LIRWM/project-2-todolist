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
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return this.currentUser;

    }

    logout() {
        // Сохраняем только состояние аутентификации
        localStorage.removeItem('currentUser');
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    checkAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }
}

export const authService = new AuthService();