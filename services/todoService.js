export function filterAndSortTodos(todos, filterPriorityValue, sortByValue, categories) {
    let filteredTodos = [...todos];

    if (filterPriorityValue !== 'all') {
        filteredTodos = filteredTodos.filter(todo => todo.priority === filterPriorityValue);
    }

    switch(sortByValue) {
        case 'priority':
            const priorityOrder = {high: 1, medium: 2, low: 3};
            filteredTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'name':
            filteredTodos.sort((a, b) => a.text.localeCompare(b.text));
            break;
        case 'dueDate':
            filteredTodos.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            break;
        case 'category':
            filteredTodos.sort((a, b) => {
                const aCategory = categories.find(cat => cat.id === a.categoryId)?.name || '';
                const bCategory = categories.find(cat => cat.id === b.categoryId)?.name || '';
                return aCategory.localeCompare(bCategory);
            });
            break;
    }
    return filteredTodos;
}
