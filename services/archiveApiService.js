const BASE_URL = 'http://localhost:3000/archivedTodos';

export async function getArchivedTodos() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Ошибка при получении архива');
    return await res.json();
}

export async function addToArchive(todo) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Ошибка при добавлении в архив');
    return await res.json();
}

export async function deleteFromArchive(id) {
    try {
        const response = await fetch(`${BASE_URL}/archivedTodos/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Ошибка при удалении задачи из архива');
        }
    } catch (error) {
        console.error('Ошибка в deleteFromArchive:', error);
        throw error;
    }
}

export async function updateToArchiveTodo(todo) {
    const res = await fetch(`${BASE_URL}/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Ошибка при обновлении архивной задачи');
    return await res.json();
}