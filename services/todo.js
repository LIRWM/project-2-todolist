class TodoService {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.archivedTodos = JSON.parse(localStorage.getItem('archivedTodos')) || [];
    }

    async getAllTodos() {
        // Получение списка задач с сервера
        return this.todos;
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
        // Архивирование задачи
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) throw new Error('Задача не найдена');

        const todoToArchive = this.todos[index];
        this.archivedTodos.push({ ...todoToArchive, archivedAt: new Date().toISOString() });
        this.todos.splice(index, 1);

        this._saveTodos();
        this._saveArchivedTodos();
    }


    _saveTodos() {
        // Сохранение списка задач в локальное хранилище
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    _saveArchivedTodos() {
        localStorage.setItem('archivedTodos', JSON.stringify(this.archivedTodos));
    }
}

export const todoService = new TodoService();