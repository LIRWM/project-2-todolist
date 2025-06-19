import { authService } from './auth.js';
import { todoService } from './todo.js';

class StatisticsService {
    constructor() {
        this.todoService = todoService;
        this.authService = authService;
    }

    async getGeneralStats() {
        try {
            if (!this.authService.currentUser) {
                throw new Error('Требуется авторизация');
            }
            // Получение общей статистики 
            // - Общее количество задач 
            // - Количество выполненных
            // - Количество в архиве
            const todos = await this.todoService.getTodos();
            const archivedTodos = await this.todoService.getArchivedTodos();

            return {
                total: todos.length,
                completed: todos.filter(todo => todo.completed).length,
                archived: archivedTodos.length,
                active: todos.filter(todo => !todo.completed).length,
                completionRate: this.calculateCompletionRate(todos)
            };
        } catch (error) {
            console.error('Ошибка при получении общей статистики:', error);
            throw error;
        }
    }

    async getCategoryStats() {
        try {
            if (!this.authService.currentUser) {
                throw new Error('Требуется авторизация');
            }
            // Статистика по категориям
            // - Количество задач в каждой категории
            // - Процент выполненных по категориям 

            const todos = await this.todoService.getTodos();
            const categories = await this.todoService.getCategories();

            const categoryStats = this.calculateCategoryStats(todos, categories);
            const uncategorizedStats = this.calculateUncategorizedStats(todos);

            return [...categoryStats, uncategorizedStats];
        } catch (error) {
            console.error('Ошибка при получении стастики по категориям:', error);
            throw error;
        }
    }

    async getProductivityStats() {
        // Статистиа продуктивности
        // - Среднее время выполнения 
        // - Тренды по дням/неделям
        try {
            if (!this.authService.currentUser) {
                throw new Error('Требуется авторизация');
            }

            const todos = await this.todoService.getTodos();
            const archivedTodos = await this.todoService.getArchivedTodos();
            const allTodos = [...todos, ...archivedTodos];

            const dayStats = this.calculateDailyStats(allTodos);
            const averageTime = this.calculateAverageCompletionTime(allTodos);

            return {
                dailyStats: dayStats,
                averageCompetionTime: averageTime
            };
        } catch (error) {
            console.error('Ошибка при получении статистики продуктивности:', error);
            throw error;
        }
    }
    
    // Вспомогательные методы
    calculateCompletionRate(todos) {
        return todos.length ?
            (todos.filter(todo => todo.completed).length / todos.length * 100).toFixed(1) : 0;
    }

    calculateCategoryStats(todos, categories) {
        return categories.map(category => {
            const categoryTodos = todos.filter(todo => todo.categoryId === category.id);
            const completed = categoryTodos.filter(todo => todo.completed).length;

            return {
                categoryId: category.id,
                categoryName: category.name,
                total: categoryTodos.length,
                completed, 
                active: categoryTodos.length - completed,
                completionRate: this.calculateCompletionRate(categoryTodos)
            };
        });
    }

    calculateUncategorizedStats(todos) {
        const uncategorizedTodos = todos.filter(todo => !todo.categoryId);
        const completed = uncategorizedTodos.filter(todo => todo.completed).length;

            return {
                categoryId: null,
                categoryName: 'Без категории',
                total: uncategorizedTodos.length,
                completed, 
                active: uncategorizedTodos.length - completed,
                completionRate: this.calculateCompletionRate(uncategorizedTodos)
            };
        }



}

export const statisticsService = new StatisticsService();