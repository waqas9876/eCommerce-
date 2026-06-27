import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY          = os.environ.get('SECRET_KEY', 'ecomx-secret-dev-2026')
    JWT_SECRET_KEY      = os.environ.get('JWT_SECRET_KEY', 'ecomx-jwt-dev-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_TOKEN_LOCATION  = ['headers']
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'mysql+pymysql://root:@localhost/ecomx?charset=utf8mb4'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_FOLDER = os.path.join(basedir, '..', 'frontend')
