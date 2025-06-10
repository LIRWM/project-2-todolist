class AuthService {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    async register(username, password) {
        // Здесь будет логика регистрации
        // API запрос к сервер
    }

    async login(username, password) {
        // Здесь будет логика авторизации
        // API запрос к серверу 
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        // Очистка локального хранилища
    }

    checkAuth() {
        return this.isAuthenticated;
    }
}

export const authService = new AuthService();