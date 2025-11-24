// Переключение между вкладками
function showTab(tabName) {
    // Скрыть все формы
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));

    // Убрать активный класс со всех кнопок
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Показать нужную форму и активировать кнопку
    document.getElementById(tabName + 'Form').classList.add('active');
    event.target.classList.add('active');
}

// Обработка формы входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Простая проверка - если поля не пустые
    if (email && password) {
        // Сохраняем данные пользователя
        localStorage.setItem('user', JSON.stringify({
            name: 'Иванова Мария Петровна',
            email: email,
            childName: 'Иванов Алексей',
            phone: '+7 (999) 123-45-67'
        }));

        // Перенаправление в личный кабинет
        window.location.href = 'profile.html';
    } else {
        alert('Заполните все поля');
    }
});

// Обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const childName = document.getElementById('regChildName').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }

    // Если все поля заполнены и пароли совпадают
    if (name && email && phone && childName && password) {
        // Сохраняем данные пользователя
        localStorage.setItem('user', JSON.stringify({
            name: name,
            email: email,
            childName: childName,
            phone: phone
        }));

        alert('Регистрация прошла успешно!');
        window.location.href = 'profile.html';
    } else {
        alert('Заполните все поля');
    }
});

// Проверка авторизации при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user');
    if (user && window.location.pathname.includes('auth.html')) {
        window.location.href = 'profile.html';
    }
});
// Синхронизация с header после входа/регистрации
function syncWithHeader() {
    if (typeof updateHeaderAuth === 'function') {
        updateHeaderAuth();
    }
    if (typeof updateNavLinks === 'function') {
        updateNavLinks();
    }
}

// Обновляем обработчики форм в auth.js
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email && password) {
        localStorage.setItem('user', JSON.stringify({
            name: 'Иванова Мария Петровна',
            email: email,
            childName: 'Иванов Алексей',
            phone: '+7 (999) 123-45-67'
        }));

        syncWithHeader();
        window.location.href = 'profile.html';
    } else {
        alert('Заполните все поля');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const childName = document.getElementById('regChildName').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }

    if (name && email && phone && childName && password) {
        localStorage.setItem('user', JSON.stringify({
            name: name,
            email: email,
            childName: childName,
            phone: phone
        }));

        syncWithHeader();
        alert('Регистрация прошла успешно!');
        window.location.href = 'profile.html';
    } else {
        alert('Заполните все поля');
    }
});