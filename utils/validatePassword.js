export function validatePassword(password, confirmPassword) {
    const errors = [];

    if (password !== confirmPassword) {
        errors.push('Пароли не совпадают');
    }
    if (password.length < 6) {
        errors.push('Пароль должен содержать минимум 6 символов');
    }
    if (!/[a-zA-Z]/.test(password)) {
        errors.push('Нужна хотя бы одна буква');
    }
    if (!/\d/.test(password)) {
        errors.push('Нужна хотя бы одна цифра');
    }
        return errors;
}