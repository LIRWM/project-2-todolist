class TodoService {
    constructor() {
        this.baseUrl = '/api/todos';
    }

    async getAllTodos() {
        // Получение списка задач с сервера
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