# Todo List Application

[English](#english) | [Русский](#русский)

# English

A modern task management web application with user authentication, categories, and completed task archiving.

## Key Features

### Authentication and Profile
- User registration and login with password validation
- User profile with customizable avatar
- Isolated user data
- Session persistence

### Task Management
- Create and delete tasks
- Edit tasks with instant saving
- Mark tasks as completed
- Set due dates
- Delete and save animations

### Organization and Categories
- Custom task categories with dropdown selection
- Task priorities (High, Medium, Low)
- Priority filtering
- Sort by priority, name, category, and due date

### Archive and Statistics
- Archive completed tasks
- View archive with preserved categories
- Real-time statistics tracking
- Active and completed task counter
- Completion progress bar

### Interface
- Dark and light theme toggle
- Responsive design
- Visual priority indicators
- Intuitive user interface
- Alert system for user notifications

## Technologies
- HTML5 and CSS3
- JavaScript (ES6+)
- Local Storage for data persistence
- Font Awesome for icons
- Modular architecture:
  - Authentication service
  - Task management service
  - Category service
  - Archive service
  - Statistics service
  - UI components

## Project Structure
```
├── assets/           # Static assets
├── services/         # Core business logic
├── ui/              # UI components
└── utils/           # Utility functions
```

## Installation and Setup
1. Clone the repository:
```bash
git clone [repository-url]
```

2. Open index.html in your browser

3. Register or log in

## Security
- User data isolation
- Secure password validation
- Session management
- Input validation

## Development Plans
- Task descriptions and notes
- Due date reminders
- Collaborative projects
- Cloud synchronization
- Mobile application

# Русский

Современное веб-приложение для управления задачами с аутентификацией пользователей, категориями и архивом выполненных задач.

## Основные возможности

### Аутентификация и профиль
- Регистрация и вход в систему с валидацией паролей
- Профиль пользователя с настраиваемым аватаром
- Изолированные данные для каждого пользователя
- Сохранение сессии пользователя

### Управление задачами
- Создание и удаление задач
- Редактирование задач с мгновенным сохранением
- Отметка о выполнении задач
- Установка сроков выполнения
- Анимации при удалении и сохранении

### Организация и категории
- Пользовательские категории задач с выпадающим списком
- Приоритеты задач (Высокий, Средний, Низкий)
- Фильтрация по приоритетам
- Сортировка по приоритету, названию, категории и сроку

### Архив и статистика
- Архивация выполненных задач
- Просмотр архива с сохранением категорий
- Отслеживание статистики в реальном времени
- Счетчик активных и выполненных задач
- Прогресс-бар выполнения

### Интерфейс
- Переключение между темной и светлой темами
- Адаптивный дизайн
- Визуальные индикаторы приоритетов
- Интуитивно понятный интерфейс
- Система оповещений для пользователя

## Технологии
- HTML5 и CSS3
- JavaScript (ES6+)
- Local Storage для хранения данных
- Font Awesome для иконок
- Модульная архитектура:
  - Сервис аутентификации
  - Сервис управления задачами
  - Сервис категорий
  - Сервис архивации
  - Сервис статистики
  - UI компоненты

## Структура проекта
```
├── assets/           # Статические ресурсы
├── services/         # Основная бизнес-логика
├── ui/              # UI компоненты
└── utils/           # Вспомогательные функции
```

## Установка и запуск
1. Клонируйте репозиторий:
```bash
git clone [url-репозитория]
```

2. Откройте index.html в браузере

3. Зарегистрируйтесь или войдите в систему

## Безопасность
- Изоляция данных пользователей
- Безопасная валидация паролей
- Управление сессиями
- Проверка входных данных

## Планы по развитию
- Описания и заметки к задачам
- Напоминания о сроках
- Совместные проекты
- Облачная синхронизация
- Мобильное приложение