class StatisticsService {
    constructor() {
        this.todoService = todoService;
    }

    async getGeneralStats() {
        // Получение общей статистики 
        // - Общее количество задач 
        // - Количество выполненных
        // - Количество в архиве
    }

    async getCategoryStats() {
        // Статистика по категориям
        // - Количество задач в каждой категории
        // - Процент выполненных по категориям 
    }

    async getProductivityStats() {
        // Статистиа продуктивности
        // - Среднее время выполнения 
        // - Тренды по дням/неделям
    }
}

export const statisticsService = new StatisticsService();