import { showAlert } from '../ui/alert.js';
import { addCategory } from '../services/categoryApiService.js';

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

    saveBtn.addEventListener('click', async () => {
        const categoryName = input.value.trim();

        if (!categoryName) {
            showAlert('Название категории не может быть пустым.');
            return;
        }

        const isDuplicate = Array.isArray(categories) && categories.some(category => 
            category && category.name === categoryName
        );

        if (isDuplicate) {
            showAlert('Такая категория уже существует.');
            return;
        }

        let newCategory = {
            id: Date.now().toString(),
            name: categoryName,
            userEmail: JSON.parse(localStorage.getItem('currentUser'))?.email || null
        };

        categories.push(newCategory);
        
        categories.sort((a, b) => {
            const nameA = typeof a === 'string' ? a : a.name;
            const nameB = typeof b === 'string' ? b : b.name;
            return nameA.localeCompare(nameB);
        });
        // Save new category to server
        try {
            const savedCategory = await addCategory(newCategory);
            // If server returned a saved category (with potentially a new id), update the local list
            if (savedCategory && savedCategory.id !== newCategory.id) {
                const idx = categories.findIndex(cat => cat.id === newCategory.id);
                if (idx !== -1) {
                    categories[idx] = savedCategory;
                } else {
                    categories.push(savedCategory);
                }
                newCategory = savedCategory;
            }
        } catch (error) {
            console.error('Ошибка при сохранении категории:', error);
            showAlert('Ошибка при сохранении категории.');
        }
        updateCategorySelect(categories);
        modal.style.display = 'none';
    });
}
