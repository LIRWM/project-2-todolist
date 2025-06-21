class TodoService {
    constructor() {
        this.initializeData();
    }
    initializeData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser?.email) {
            this.todos = JSON.parse(localStorage.getItem(`todos_${currentUser.email}`)) || [];
            this.archivedTodos = JSON.parse(localStorage.getItem(`archivedTodos_${currentUser.email}`)) || [];
        } else {
            this.todos = [];
            this.archivedTodos = [];
        }
    }

    async getAllTodos() {
        // Получение списка задач с сервера
        this.initializeData();
        return this.todos;
    }

    async getArchivedTodos() {
        this.initializeData();
        return this.archivedTodos;
    }

    _getCurrentUserEmail() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser?.email;
    }

    _saveTodos() {
        // Сохранение списка задач в локальное хранилище
        const userEmail = this._getCurrentUserEmail();
        if (userEmail) {
            localStorage.setItem(`todos_${userEmail}`, JSON.stringify(this.todos));
        }
    }

    _saveArchivedTodos() {
        const userEmail = this._getCurrentUserEmail();
        if (userEmail) {
            localStorage.setItem(`archivedTodos_${userEmail}`, JSON.stringify(this.archivedTodos));
        }
    }

    async createTodo(todoData) {
        // Создание новой задачи
        const newTodo = {
            id: Date.now(),
            ...todoData,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.todos.push(newTodo);
        this._saveTodos();
        return newTodo;
    }

    async updateTodo(id, todoData) {
        // Обновление задачи
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) throw new Error('Задача не найдена');

        this.todos[index] = { ...this.todos[index], ...todoData };
        this._saveTodos();
        return this.todos[index];
    }

    async deleteTodo(id) {
        // Удаление задачи
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) throw new Error('Задача не найдена');

        this.todos.splice(index, 1);
        this._saveTodos();
    }

    async archiveTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) throw new Error('Задача не найдена');

        const todoToArchive = this.todos[index];
        const category = todoToArchive.categoryId ? 
            categories.find(cat => cat.id === todoToArchive.categoryId)?.name : 
            'Без категории';

        this.archivedTodos.push({
            ...todoToArchive,
            category,
            archiveDate: new Date().toISOString()
        });
        
        this.todos.splice(index, 1);
        this._saveTodos();
        this._saveArchivedTodos();
    }
}

export const todoService = new TodoService();