import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY          = os.environ.get('SECRET_KEY', 'ecomx-secret-dev-2026')
    JWT_SECRET_KEY      = os.environ.get('JWT_SECRET_KEY', 'ecomx-jwt-dev-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_TOKEN_LOCATION  = ['headers']
    _db_url = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:@localhost/ecomx?charset=utf8mb4')
    # Render provides postgres:// but SQLAlchemy needs postgresql://
    if _db_url.startswith('postgres://'):
        _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_FOLDER = os.path.join(basedir, '..', 'frontend')
