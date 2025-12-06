from fastapi import FastAPI, Form, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
import sqlite3
import hashlib
import os
from pathlib import Path

app = FastAPI()

# Пути к фронтенду
BASE_DIR = Path(__file__).resolve().parent.parent  # Папка Lab1
FRONTEND_DIR = BASE_DIR / "frontend"
STATIC_DIR = FRONTEND_DIR

# Подключаем статические файлы (CSS, JS, изображения)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Шаблонизатор для HTML
templates = Jinja2Templates(directory=str(FRONTEND_DIR))


# ----------------- Простая база данных -----------------

def get_db_connection():
    """Создает соединение с SQLite базой"""
    db_path = BASE_DIR / "data" / "school.db"
    # Создаем папку data если её нет
    db_path.parent.mkdir(exist_ok=True)

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Инициализирует базу данных"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print("✅ База данных инициализирована")


# Инициализируем БД при старте
init_db()


# ----------------- API эндпоинты -----------------

@app.post("/api/register")
async def register(
        username: str = Form(...),
        email: str = Form(...),
        password: str = Form(...)
):
    """Простая регистрация пользователя"""

    # Хэшируем пароль
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )
        user_id = cursor.lastrowid
        conn.commit()

        return {
            "success": True,
            "message": "Регистрация успешна",
            "user_id": user_id
        }

    except sqlite3.IntegrityError:
        return JSONResponse(
            content={"success": False, "message": "Пользователь уже существует"},
            status_code=400
        )
    finally:
        conn.close()


@app.post("/api/login")
async def login(
        username: str = Form(...),
        password: str = Form(...)
):
    """Простой вход пользователя"""

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        (username, hashed_password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return {
            "success": True,
            "message": "Вход выполнен",
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "created_at": user['created_at']
            }
        }
    else:
        return JSONResponse(
            content={"success": False, "message": "Неверный логин или пароль"},
            status_code=401
        )


# ----------------- Обработка HTML страниц -----------------

# Список существующих HTML файлов
HTML_FILES = [
    "index.html", "auth.html", "about.html", "contacts.html",
    "english.html", "news.html", "parents.html", "profile.html",
    "program.html", "schedule.html", "students.html", "teachers.html",
    "news-single1.html", "news-single2.html", "news-single3.html",
    "news-single4.html", "news-single5.html", "news-single6.html"
]


@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    """Главная страница"""
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/auth", response_class=HTMLResponse)
async def serve_auth(request: Request):
    """Страница авторизации"""
    return templates.TemplateResponse("auth.html", {"request": request})


# Динамические маршруты для всех остальных страниц
@app.get("/{page_name}", response_class=HTMLResponse)
async def serve_page(request: Request, page_name: str):
    """Обработка всех остальных страниц"""
    # Проверяем существование файла
    file_path = FRONTEND_DIR / f"{page_name}.html"

    if file_path.exists():
        return templates.TemplateResponse(f"{page_name}.html", {"request": request})

    # Если файл не найден, пробуем без расширения .html
    file_path_no_ext = FRONTEND_DIR / page_name
    if file_path_no_ext.exists() and file_path_no_ext.suffix == '.html':
        return templates.TemplateResponse(page_name, {"request": request})

    # Если страница не найдена - возвращаем 404 или главную
    return templates.TemplateResponse("index.html", {"request": request})


# ----------------- Дополнительные маршруты -----------------

@app.get("/api/health")
async def health_check():
    """Проверка работы API"""
    return {"status": "ok", "message": "API работает"}


@app.get("/api/users")
async def get_all_users():
    """Получить всех пользователей (для отладки)"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, username, email, created_at FROM users")
    users = cursor.fetchall()
    conn.close()

    return {"users": [dict(user) for user in users]}


# Обработчик для favicon.ico (чтобы не было ошибок 404)
@app.get("/favicon.ico")
async def favicon():
    return FileResponse(FRONTEND_DIR / "favicon.ico" if (FRONTEND_DIR / "favicon.ico").exists() else None)