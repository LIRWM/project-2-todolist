import { getArchivedTodos, deleteToArchiveTodo } from '../services/archiveApiService.js';

export async function showArchiveModal(categories) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';

    const archiveContainer = document.createElement('div');
    archiveContainer.className = 'archive-container';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'x';
    closeBtn.className = 'close-btn';
    closeBtn.onclick = () => document.body.removeChild(modal);

    const title = document.createElement('h2');
    title.textContent = 'Архив задач';

    const archiveList = document.createElement('div');
    archiveList.className = 'archive-list';

    try {
        const archivedTodos = await getArchivedTodos();

        archivedTodos.forEach((todo, index) => {
            const archiveItem = document.createElement('div');
            archiveItem.className = 'archive-item';

            const number = document.createElement('span');
            number.className = 'archive-number';
            number.textContent = `${index + 1}. `;

            const text = document.createElement('span');
            text.textContent = todo.text;

            const category = categories.find(c => c.id === todo.categoryId);
            const categoryBadge = document.createElement('span');
            categoryBadge.className = 'category-badge';
            categoryBadge.textContent = category ? category.name : 'Без категории';

            const dateSpan = document.createElement('span');
            dateSpan.className = 'archive-date';
            dateSpan.textContent = new Date(todo.archiveDate).toLocaleDateString();

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.onclick = async () => {
                await deleteToArchiveTodo(todo.id);
                document.body.removeChild(modal);
                showArchiveModal(categories); // повторная отрисовка
            };

            archiveItem.append(number, text, categoryBadge, dateSpan, deleteBtn);
            archiveList.appendChild(archiveItem);
        });

    } catch (error) {
        console.error('Ошибка при загрузке архива:', error);
        archiveList.textContent = 'Не удалось загрузить архивные задачи.';
    }

    archiveContainer.append(closeBtn, title, archiveList);
    modal.appendChild(archiveContainer);
    document.body.appendChild(modal);
}