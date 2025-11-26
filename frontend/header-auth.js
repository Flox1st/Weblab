// header-auth.js - управление формой входа в header

// Функция входа через header
function headerLogin() {
    const login = document.getElementById('headerLogin').value;
    const password = document.getElementById('headerPassword').value;

    if (login && password) {
        // Сохраняем данные пользователя
        localStorage.setItem('user', JSON.stringify({
            name: 'Иванова Мария Петровна',
            email: login,
            childName: 'Иванов Алексей',
            phone: '+7 (999) 123-45-67'
        }));

        updateHeaderAuth();
        alert('Вход выполнен успешно!');
    } else {
        alert('Введите логин и пароль');
    }
}

// Функция выхода
function headerLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('user');
        updateHeaderAuth();
    }
}

// Обновление отображения в header
function updateHeaderAuth() {
    const user = localStorage.getItem('user');
    const guestView = document.getElementById('guestView');
    const userView = document.getElementById('userView');
    const userGreeting = document.getElementById('userGreeting');

    if (user) {
        const userData = JSON.parse(user);
        guestView.style.display = 'none';
        userView.style.display = 'block';
        userGreeting.textContent = `Здравствуйте, ${userData.name.split(' ')[1]}!`; // Показываем только имя
    } else {
        guestView.style.display = 'block';
        userView.style.display = 'none';
    }
}

// Обновление навигационных ссылок
function updateNavLinks() {
    const authLinks = document.querySelectorAll('a[href="auth.html"]');
    const navAuthLinks = document.querySelectorAll('.nav-bar a[href="auth.html"]');
    const contactsLinks = document.querySelectorAll('.nav-bar a[href="contacts.html"]');

    if (user) {
        authLinks.forEach(link => {
            link.href = 'profile.html';
            link.textContent = 'Личный кабинет';
        });
        navAuthLinks.forEach(link => {
            link.style.backgroundColor = '#e68a00';
        });
    } else {
        authLinks.forEach(link => {
            link.href = 'auth.html';
            link.textContent = 'Войти';
        });
        navAuthLinks.forEach(link => {
            link.style.backgroundColor = '';
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderAuth();
    updateNavLinks();
});