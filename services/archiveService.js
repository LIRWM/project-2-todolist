export function archiveTodo(todo) {
    return {
        ...todo,
        archiveDate: new Date().toISOString()
    };
}