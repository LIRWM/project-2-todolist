import { authService } from '../services/auth.js';

export function saveCategories(categories) {
    const userEmail = authService.currentUser?.email;
        if (!userEmail) return false;

    try {
        localStorage.setItem(`categories_${userEmail}`, JSON.stringify(categories));
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении категорий:', error);
        return false;
    }
}

export function loadCategories() {
    const userEmail = authService.currentUser?.email;
        if (!userEmail) return [];

    try {
        const data = localStorage.getItem(`categories_${userEmail}`);
        const raw = data ? JSON.parse(data) : [];

        // Преобразуем старые строки в объекты
        return raw.map(cat => 
            typeof cat === 'string' ? { id: Date.now().toString(), name: cat } : cat
        );
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        return [];
    }
}