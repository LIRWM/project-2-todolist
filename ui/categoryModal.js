import { showAlert } from '../ui/alert.js';

export function setupCategoryModal(categories, addCategory, updateCategorySelect) {
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

    saveBtn.addEventListener('click', async () => {
        const categoryName = input.value.trim();

        if (!categoryName) {
            showAlert('Название категории не может быть пустым.');
            return;
        }

        const isDuplicate = categories.some(category => category.name === categoryName);
        if (isDuplicate) {
            showAlert('Такая категория уже существует.');
            return;
        }

        try {
            const newCategory = await addCategory({ name: categoryName });
            categories.push(newCategory);

            categories.sort((a, b) => {
                const nameA = typeof a === 'string' ? a : a.name;
                const nameB = typeof b === 'string' ? b : b.name;
                return nameA.localeCompare(nameB);
            });

            updateCategorySelect(categories);
            modal.style.display = 'none';
        } catch (error) {
            showAlert('Ошибка при добавлении категории.');
            console.error(error);
        }
    });
} 
