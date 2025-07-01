import { showAlert } from '../ui/alert.js';

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

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveBtn.addEventListener('click', () => {
        const categoryName = input.value.trim();

        if (!categoryName) {
            showAlert('Название категории не может быть пустым.');
            return;
        }

        const isDuplicate = categories.some(category => {
            return typeof category === 'string'
                ? category === categoryName
                : category.name === categoryName;
        });

        if (isDuplicate) {
            showAlert('Такая категория уже существует.');
            return;
        }

        const newCategory = {
            id: Date.now().toString(),
            name: categoryName
        };

        categories.push(newCategory);
        saveCategories(categories);
        updateCategorySelect(categories);
        modal.style.display = 'none';
    });
}