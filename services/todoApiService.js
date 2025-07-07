import { BASE_URL } from './apiConfig.js';
const TODO_URL = `${BASE_URL}/todos`;

export async function getTodos(userEmail) {
    const url = userEmail ? `${TODO_URL}?userEmail=${encodeURIComponent(userEmail)}` : TODO_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Ошибка при получении списка задач');
    return await res.json();
}

export async function addTodo(todo) {
    const res = await fetch(TODO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Ошибка при добавлении задачи');
    return await res.json();
}

export async function deleteTodo(id) {
    const res = await fetch(`${TODO_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Ошибка при удалении задачи');
}

export async function updateTodo(id, updates) {
    const res = await fetch(`${TODO_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Ошибка при обновлении задачи');
    return await res.json();
}
