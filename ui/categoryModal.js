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
        const newCategory = input.value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            saveCategories(categories);
            updateCategorySelect(categories);
        }
        modal.style.display = 'none';
    });
}