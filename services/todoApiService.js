const BASE_URL = 'http://localhost:3000/archivedTodos';

export async function getTodos() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Ошибка при получении архива');
    return await res.json();
}

export async function addTodo(todo) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Ошибка при добавлении в архив');
    return await res.json();
}

export async function deleteTodo(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Ошибка при удалении из архива');
}

export async function updateTodo(todo) {
    const res = await fetch(`${BASE_URL}/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Ошибка при обновлении архивной задачи');
    return await res.json();
}