export function validatePassword(password, confirmPassword) {
    const errors = [];
        if (password !== confirmPassword) {
            errors.push('Пароли не совпадают');
        }
        if (password.length < 6) {
            errors.push('Пароль должен содержать минимум 6 символов');
        }
        const hasLetter = /[a-zA-Z]/.test(password);
        if (!hasLetter) {
            errors.push('Нужна хотя бы одна буква');
        }
        const hasDigit = /\d/.test(password);
        if (!hasDigit) { 
            errors.push('Нужна хотя бы одна цифра');
        }
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        if (!hasSymbol) {
            errors.push('Нужен спецсимвол');
        }

        return errors;
}