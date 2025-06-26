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