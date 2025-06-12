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
    }

    async updateTodo(id, todoData) {
        // Обновление задачи
    }

    async deleteTodo(id) {
        // Удаление задачи
    }

    async archiveTodo(id) {
        // Архивирование задачи
    }
}

export const todoService = new TodoService();