    export function showArchiveModal(archivedTodos, categories) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const archiveContainer = document.createElement('div');
        archiveContainer.className = 'archive-container'; 

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'x';
        closeBtn.className = 'close-btn';
        closeBtn.onclick = () => document.body.removeChild(modal);

        const title = document.createElement('h2');
        title.textContent = 'Архив задач';

        const archiveList = document.createElement('div');
        archiveList.className = 'archive-list';

        archivedTodos.forEach((todo, index) => {
            const archiveItem = document.createElement('div');
            archiveItem.className = 'archive-item';

            const number = document.createElement('span');
            number.className = 'archive-number';
            number.textContent = `${index + 1}. `;

            const text = document.createElement('span');
            text.textContent = todo.text;

            const category = document.createElement('span');
            category.className = 'archive-category';
            const todoCategory = categories.find(cat => cat.id === todo.categoryId);
            category.textContent = todoCategory ? todoCategory.name : 'Без категории';

            const date = document.createElement('span');
            date.className = 'archive-date';
            if (todo.archiveDate) {
                date.textContent = new Date(todo.archiveDate).toLocaleDateString();
            }

            archiveItem.appendChild(number);
            archiveItem.appendChild(text);
            archiveItem.appendChild(category);
            archiveItem.appendChild(date);
            archiveList.appendChild(archiveItem);
        });

        archiveContainer.appendChild(closeBtn);
        archiveContainer.appendChild(title);
        archiveContainer.appendChild(archiveList);
        modal.appendChild(archiveContainer);
        document.body.appendChild(modal);
    }