from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Production-ready configuration settings."""
    
    # Application
    PROJECT_NAME: str = "KhetiTak"
    VERSION: str = "2.0.0"
    DESCRIPTION: str = "KhetiTak Smart Agriculture & Village AgriStore"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite:///./krishi_ai.db"
    DATABASE_SYNC_URL: Optional[str] = None
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    FIRST_ORDER_DISCOUNT_PERCENT: float = Field(default=10, ge=0, le=100)
    COMMISSION_PERCENT: float = Field(default=10, ge=0, le=100)
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "krishi_ai"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "root"
    
    # Security
    SECRET_KEY: str = "krishi-ai-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
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

    # Razorpay (server-side only)
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    RAZORPAY_WEBHOOK_SECRET: Optional[str] = None
    
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
    SMTP_USERNAME: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None
    ALERT_EMAIL: Optional[str] = None

    # Authentication providers
    GOOGLE_CLIENT_ID: str = ""
    SMS_PROVIDER: str = "mock"
    EMAIL_PROVIDER: str = "mock"
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_FROM_NUMBER: str = ""
    MSG91_AUTH_KEY: str = ""
    MSG91_TEMPLATE_ID: str = ""
    AWS_SNS_REGION: str = ""
    RESEND_API_KEY: str = ""
    BREVO_API_KEY: str = ""
    BREVO_SENDER_EMAIL: Optional[str] = None
    BREVO_SENDER_NAME: str = "KhetiTak"
    SENDGRID_API_KEY: str = ""
    OTP_EXPIRE_MINUTES: int = 10
    OTP_MAX_ATTEMPTS: int = 5
    SHOP_OWNER_IDENTIFIERS: str = ""
    
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
    
    @field_validator("ALLOWED_ORIGINS", mode="before")
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @field_validator("ALLOWED_METHODS", mode="before")
    def parse_cors_methods(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @field_validator("ALLOWED_HEADERS", mode="before")
    def parse_cors_headers(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore")

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value):
        if not isinstance(value, str):
            return value
        if value.startswith("sqlite:///") and not value.startswith("sqlite+aiosqlite:///"):
            return value.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
        if value.startswith("postgres://"):
            value = value.replace("postgres://", "postgresql+asyncpg://", 1)
        elif value.startswith("postgresql://"):
            value = value.replace("postgresql://", "postgresql+asyncpg://", 1)
        if "sslmode=" in value:
            value = value.replace("sslmode=", "ssl=", 1)
        return value

    @field_validator("DATABASE_SYNC_URL", mode="before")
    @classmethod
    def normalize_sync_database_url(cls, value, info):
        value = value or info.data.get("DATABASE_URL")
        if not isinstance(value, str):
            return value
        if value.startswith("sqlite+aiosqlite:///"):
            return value.replace("sqlite+aiosqlite:///", "sqlite:///", 1)
        if value.startswith("postgres://"):
            value = value.replace("postgres://", "postgresql://", 1)
        elif value.startswith("postgresql+asyncpg://"):
            value = value.replace("postgresql+asyncpg://", "postgresql://", 1)
        if "ssl=" in value and "sslmode=" not in value:
            value = value.replace("ssl=", "sslmode=", 1)
        return value

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
    return settings.DATABASE_URL
