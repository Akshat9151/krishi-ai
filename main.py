from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import time
import os

from routes import router, legacy_router
from services import auth
from services.logger import logging_middleware, logger
from services.rate_limiter import limiter, custom_rate_limit_exceeded_handler, RateLimitExceeded
from services.monitoring import router as monitoring_router, metrics_middleware
from services import store_api

from sqlalchemy import text
from backend.database import engine, SessionLocal
from backend.models import Base
import backend.models_store  # Register store models with Base
from services.seed_data import seed_database
from services.config import settings

if os.getenv("RENDER") and settings.DATABASE_URL.startswith("sqlite"):
    raise RuntimeError(
        "DATABASE_URL must point to Neon/PostgreSQL on Render. "
        "Refusing to start with temporary SQLite storage."
    )

# Create FastAPI app
app = FastAPI(
    title="KhetiTak",
    description="Smart Agriculture & Village AgriStore Platform",
    version="2.0"
)

# Set up rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# Idempotent column patches – ensure Neon PostgreSQL is up-to-date even when
# Alembic migrations were already marked as applied before new columns existed.
# ALTER TABLE … ADD COLUMN IF NOT EXISTS is safe to run repeatedly.
# ---------------------------------------------------------------------------
_COLUMN_PATCHES = [
    "ALTER TABLE store_products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 50",
    "ALTER TABLE store_products ADD COLUMN IF NOT EXISTS shop_owner_id INTEGER REFERENCES users(id)",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS shop_id INTEGER REFERENCES users(id)",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS shop_owner_id INTEGER REFERENCES users(id)",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS rider_id INTEGER REFERENCES users(id)",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS shop_notes VARCHAR",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP",
    "ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR NOT NULL DEFAULT 'farmer'",
]

if not settings.DATABASE_URL.startswith("sqlite"):
    try:
        with engine.connect() as _conn:
            for _sql in _COLUMN_PATCHES:
                try:
                    _conn.execute(text(_sql))
                except Exception:
                    pass  # column already exists or table doesn't exist yet — ignore
            _conn.commit()
        print("[INFO] Column patches applied successfully.")
    except Exception as _e:
        print(f"[WARN] Column patch step failed: {_e}")

# Create database tables for local fallback and ensure the idempotent catalog
# exists after production migrations.
try:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_database(db)
    print("[INFO] Database tables and store catalog verified.")
except Exception as e:
    print(f"[ERROR] Error creating database tables or store catalog: {e}")

# CORS middleware - Allow deployed frontend origins and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://khetitak.in",
        "https://www.khetitak.in",
        "https://krishi-ai-sable-sigma.vercel.app",
        "https://krishi-cr87mahkb-akshat9151s-projects.vercel.app",
        "https://krishi-cr87mabkb-akshat9151s-projects.vercel.app",
        "https://krishi-ai-j359.onrender.com",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://krishi-[a-z0-9-]+-akshat9151s-projects\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Logging middleware
app.middleware("http")(logging_middleware)

# Metrics middleware
app.middleware("http")(metrics_middleware)

# Include routers
app.include_router(router)
app.include_router(auth.router)
app.include_router(monitoring_router)
app.include_router(store_api.router)
# legacy endpoint at /predict/crop
app.include_router(legacy_router)

# Root API
@app.get("/")
def home():
    return {"message": "🚀 Welcome to KhetiTak API – Smart Agriculture & AgriStore Platform"}