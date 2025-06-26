export function updateCategorySelect(categories) {
       const categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = '<option value="">Без категории</option>';
        categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}