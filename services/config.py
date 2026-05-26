import os
from typing import List, Optional
from pydantic import BaseSettings, validator

class Settings(BaseSettings):
    """Production-ready configuration settings."""
    
    # Application
    PROJECT_NAME: str = "Krishi AI"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Crop Recommendation System"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite:///./krishi_ai.db"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "krishi_ai"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "root"
    
    # Security
    SECRET_KEY: str = "krishi-ai-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ]
    ALLOWED_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE"]
    ALLOWED_HEADERS: List[str] = ["*"]
    
    # Rate Limiting
    REDIS_URL: str = "redis://localhost:6379/0"
    RATE_LIMIT_ENABLED: bool = True
    DEFAULT_RATE_LIMIT: str = "100/minute"
    AUTH_RATE_LIMIT: str = "5/minute"
    ML_RATE_LIMIT: str = "30/minute"
    WEATHER_RATE_LIMIT: str = "20/minute"
    AI_ASSISTANT_RATE_LIMIT: str = "10/minute"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "krishi_ai.log"
    ERROR_LOG_FILE: str = "krishi_ai_errors.log"
    LOG_FORMAT: str = "json"
    
    # External APIs
    WEATHER_API_BASE_URL: str = "https://api.open-meteo.com/v1"
    WEATHER_API_TIMEOUT: int = 10
    
    # ML Models
    MODEL_PATH: str = "services/crop_model.pkl"
    MODEL_CACHE_ENABLED: bool = True
    MODEL_PREDICTION_TIMEOUT: int = 30
    
    # Monitoring
    HEALTH_CHECK_ENABLED: bool = True
    METRICS_ENABLED: bool = True
    PROMETHEUS_ENABLED: bool = False
    
    # Performance
    MAX_WORKERS: int = 4
    WORKER_TIMEOUT: int = 120
    KEEP_ALIVE: int = 2
    MAX_REQUESTS: int = 1000
    MAX_REQUESTS_JITTER: int = 100
    
    # SSL/HTTPS
    SSL_ENABLED: bool = False
    SSL_CERT_PATH: Optional[str] = None
    SSL_KEY_PATH: Optional[str] = None
    
    # Cache
    CACHE_ENABLED: bool = True
    CACHE_TTL: int = 3600
    CACHE_MAX_SIZE: int = 1000
    
    # Email (for alerts)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    ALERT_EMAIL: Optional[str] = None
    
    # Backup
    BACKUP_ENABLED: bool = False
    BACKUP_SCHEDULE: str = "0 2 * * *"
    BACKUP_RETENTION_DAYS: int = 30
    BACKUP_PATH: str = "/backups/krishi_ai"
    
    # Feature Flags
    ENABLE_AI_ASSISTANT: bool = True
    ENABLE_CROP_PREDICTION: bool = True
    ENABLE_DISEASE_DETECTION: bool = True
    ENABLE_WEATHER_API: bool = True
    ENABLE_MARKETPLACE: bool = True
    
    # Security Headers
    SECURE_HEADERS_ENABLED: bool = True
    X_FRAME_OPTIONS: str = "DENY"
    X_CONTENT_TYPE_OPTIONS: str = "nosniff"
    X_XSS_PROTECTION: str = "1; mode=block"
    STRICT_TRANSPORT_SECURITY: str = "max-age=31536000; includeSubDomains"
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @validator("ALLOWED_METHODS", pre=True)
    def parse_cors_methods(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @validator("ALLOWED_HEADERS", pre=True)
    def parse_cors_headers(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()

def get_settings() -> Settings:
    """Get application settings."""
    return settings

def is_production() -> bool:
    """Check if running in production mode."""
    return not settings.DEBUG and not settings.TESTING

def is_development() -> bool:
    """Check if running in development mode."""
    return settings.DEBUG or settings.DEVELOPMENT

def get_database_url() -> str:
    """Get complete database URL."""
    if settings.DATABASE_URL:
        return settings.DATABASE_URL
    
    return (
        f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}"
        f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
    )
