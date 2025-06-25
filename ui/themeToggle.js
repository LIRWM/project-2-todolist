export function themeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    let isDarkTheme = localStorage.getItem('theme') === 'dark';
    if (isDarkTheme) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        const theme = isDarkTheme ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    });
}