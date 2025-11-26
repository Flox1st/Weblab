from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

Base = declarative_base()


# Модели базы данных
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="student")  # student, teacher, parent, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # achievements, events, olympiads, etc.
    author_id = Column(Integer, nullable=False)
    image_url = Column(String(255), nullable=True)
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class Homework(Base):
    __tablename__ = "homework"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(50), nullable=False)
    class_level = Column(String(10), nullable=False)  # 5, 6, 7, etc.
    description = Column(Text, nullable=False)
    due_date = Column(DateTime, nullable=False)
    teacher_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())


# Pydantic модели для API
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    role: str = "student"


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class NewsCreate(BaseModel):
    title: str
    content: str
    category: str
    image_url: Optional[str] = None


class NewsResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str
    author_id: int
    image_url: Optional[str]
    views: int
    created_at: datetime