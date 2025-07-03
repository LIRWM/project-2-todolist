const BASE_URL = 'http://localhost:3000/todos';

export  async function getTodos() {
    const res = await fetch(BASE_URL);
    return await res.json();
}

export  async function addTodos() {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    });
    return await res.json();
}

export async function deleteTodo(id) {
    return await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
}

export async function updateTodo(id, updates) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return await res.json();
}