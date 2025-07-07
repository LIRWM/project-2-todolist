import { BASE_URL } from './apiConfig.js';
const ARCHIVE_URL = `${BASE_URL}/archivedTodos`;

export async function getArchivedTodos() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userEmail = currentUser?.email;
    const url = userEmail ? `${ARCHIVE_URL}?userEmail=${encodeURIComponent(userEmail)}` : ARCHIVE_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Ошибка при получении архива');
    return await res.json();
}

export async function addToArchive(todo) {
    const res = await fetch(ARCHIVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Ошибка при добавлении в архив');
    return await res.json();
}

export async function deleteToArchiveTodo(id) {
    const res = await fetch(`${ARCHIVE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Ошибка при удалении из архива');
}

export async function updateToArchiveTodo(todo) {
    const res = await fetch(`${ARCHIVE_URL}/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Ошибка при обновлении архивной задачи');
    return await res.json();
}
