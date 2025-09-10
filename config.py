import os
from datetime import timedelta
import secrets

class Config:
    """Base configuration class"""
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    CORS_ORIGINS = ['*']

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(Config.BASE_DIR, "instance", "fee_management.db")}'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # Get database URL from environment variable
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    if DATABASE_URL:
        # Use cloud database
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Fallback to SQLite
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(Config.BASE_DIR, "instance", "fee_management.db")}'

class RailwayConfig(ProductionConfig):
    """Railway.app specific configuration"""
    # Railway automatically provides DATABASE_URL environment variable
    pass

class SupabaseConfig(ProductionConfig):
    """Supabase specific configuration"""
    # Supabase provides PostgreSQL connection string
    pass

class NeonConfig(ProductionConfig):
    """Neon.tech specific configuration"""
    # Neon provides PostgreSQL connection string
    pass

class PlanetScaleConfig(ProductionConfig):
    """PlanetScale specific configuration"""
    # PlanetScale provides MySQL connection string
    pass

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'railway': RailwayConfig,
    'supabase': SupabaseConfig,
    'neon': NeonConfig,
    'planetscale': PlanetScaleConfig,
    'default': DevelopmentConfig
}
