import { BASE_URL } from './apiConfig.js';
const CATEGORY_URL = `${BASE_URL}/categories`;

export async function getCategories() {
    const res = await fetch(CATEGORY_URL);
    if (!res.ok) throw new Error('Ошибка при получении категорий');
    return await res.json();
}

export async function addCategory(category) {
    const res = await fetch(CATEGORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error('Ошибка при добавлении категории');
    return await res.json();
}

export async function deleteCategory(id) {
    const res = await fetch(`${CATEGORY_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Ошибка при удалении категории');
}

export async function updateCategory(id, updates) {
    const res = await fetch(`${CATEGORY_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Ошибка при обновлении категории');
    return await res.json();
}
