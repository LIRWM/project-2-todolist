export function filterAndSortTodos(todos, filterPriorityValue, sortByValue, categories) {
    let filteredTodos = [...todos];

    if (filterPriorityValue !== 'all') {
        filteredTodos = filteredTodos.filter(todo => todo.priority === filterPriorityValue);
    }

    switch (sortByValue) {
        case 'date':
            filteredTodos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
        case 'priority':
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            filteredTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        default:
            break;
    }

    return filteredTodos;
}
