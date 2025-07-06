const BASE_URL = 'http://localhost:3000/categories';

export async function getCategories() {
    const res = await fetch(BASE_URL);
    return await res.json();
}

export async function addCategory(category) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    });
    return await res.json();
}

export async function deleteCategory(id) {
    return await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
}

export async function updateCategory(id, updates) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return await res.json();
}