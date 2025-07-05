const BASE_URL = 'http://localhost:3000/archivedTodos';

export  async function getArchivedTodos() {
    const res = await fetch(BASE_URL);
    return await res.json();
}

export  async function addToArchive(todo) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    return await res.json();
}

export async function deleteToArchiveTodo(id) {
    return await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
}


export async function updateToArchiveTodo(todo) {
    const res = await fetch(`${BASE_URL}/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) {
        throw new Error('Ошибка при обновлении архивной задачи');
    }
    return await res.json();
}