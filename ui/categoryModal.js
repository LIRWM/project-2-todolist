export function setupCategoryModal(categories, saveCategories, updateCategorySelect) {
    const modal = document.getElementById('categoryModal');
    const input = document.getElementById('newCategoryInput');
    const saveBtn = document.getElementById('saveCategoryBtn');
    const cancelBtn = document.getElementById('cancelCategoryBtn');
    const addCategoryBtn = document.getElementById('addCategoryButton');

    addCategoryBtn.addEventListener('click', () => {
        input.value = '';
        modal.style.display = 'flex';
        input.focus();
    });

    // Закрытие модалки
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Сохранение новой категории
    saveBtn.addEventListener('click', () => {
        const newCategory = input.value.trim();

        // Проверка на пустую строку
        if (!newCategory) {
            modal.style.display = 'none';
            return;
        }

        // Проверка на дубликат
        if (categories.includes(newCategory)) {
            alert('Такая категория уже существует');
            return;
        }

        // Добавление
        categories.push(newCategory);
        saveCategories(categories);
        updateCategorySelect(categories);
        modal.style.display = 'none';
    });
}