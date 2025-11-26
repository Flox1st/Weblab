// profile.js - логика личного кабинета

document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user');

    if (!user) {
        // Если пользователь не авторизован, перенаправляем на страницу авторизации
        window.location.href = 'auth.html';
        return;
    }

    const userData = JSON.parse(user);
    displayProfile(userData);
});

function displayProfile(userData) {
    const profileContent = document.getElementById('profileContent');

    profileContent.innerHTML = `
        <div class="profile-header">
            <h1>Добро пожаловать, ${userData.name}!</h1>
            <p>Личный кабинет родителя</p>
            <button class="logout-btn" onclick="logout()">Выйти</button>
        </div>

        <div class="profile-info">
            <div class="info-card">
                <h3>📋 Личная информация</h3>
                <p><strong>ФИО родителя:</strong> ${userData.name}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Телефон:</strong> ${userData.phone || '+7 (999) 123-45-67'}</p>
            </div>

            <div class="info-card">
                <h3>👶 Информация о ребенке</h3>
                <p><strong>ФИО ребенка:</strong> ${userData.childName}</p>
                <p><strong>Класс:</strong> 1А</p>
                <p><strong>Куратор:</strong> Петрова Анна Ивановна</p>
            </div>

            <div class="info-card">
                <h3>📚 Учебный процесс</h3>
                <p><strong>Расписание:</strong> <a href="#" style="color: #ff9900;">Посмотреть</a></p>
                <p><strong>Успеваемость:</strong> <a href="#" style="color: #ff9900;">Открыть дневник</a></p>
                <p><strong>Домашние задания:</strong> <a href="#" style="color: #ff9900;">Просмотреть</a></p>
            </div>

            <div class="info-card">
                <h3>🎨 Дополнительное образование</h3>
                <p><strong>Кружки:</strong> Хор, Живопись</p>
                <p><strong>Спорт:</strong> Плавание</p>
                <p><strong>Посещаемость:</strong> 95%</p>
            </div>
        </div>

        <div class="info-card">
            <h3>📅 Ближайшие события</h3>
            <ul class="square-list">
                <li><strong>15 января:</strong> Родительское собрание</li>
                <li><strong>20 января:</strong> Открытый урок английского</li>
                <li><strong>25 января:</strong> Спортивные соревнования</li>
                <li><strong>30 января:</strong> Творческий вечер</li>
            </ul>
        </div>

        <div class="info-card">
            <h3>💬 Обратная связь</h3>
            <p>По всем вопросам обращайтесь к классному руководителю:</p>
            <p><strong>Петрова Анна Ивановна</strong></p>
            <p>📞 +7 (495) 123-45-67</p>
            <p>✉️ teacher@lampada.ru</p>
        </div>
    `;
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    }
}

// Проверка авторизации при загрузке страниц
function checkAuth() {
    const user = localStorage.getItem('user');
    const currentPage = window.location.pathname;

    if (!user && currentPage.includes('profile.html')) {
        window.location.href = 'auth.html';
    }

    if (user && currentPage.includes('auth.html')) {
        window.location.href = 'profile.html';
    }
}

// Вызываем проверку при загрузке
checkAuth();