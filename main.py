from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
import time

from routes import router, legacy_router
from services import auth
from services.logger import logging_middleware, logger
from services.rate_limiter import limiter, custom_rate_limit_exceeded_handler, RateLimitExceeded
from services.monitoring import router as monitoring_router, metrics_middleware
from services import store_api

from backend.database import engine, SessionLocal
from backend.models import Base
import backend.models_store  # Register store models with Base

# Create FastAPI app
app = FastAPI(
    title="KhetiTak",
    description="Smart Agriculture & Village AgriStore Platform",
    version="2.0"
)

# Set up rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)

# Create database tables for local fallback. Production deployments should run
# Alembic before starting; no demo or product data is seeded at startup.
try:
    Base.metadata.create_all(bind=engine)
    print("[INFO] Database tables verified; startup seeding is disabled.")
except Exception as e:
    print(f"[ERROR] Error creating/seeding database tables: {e}")

# CORS middleware - Allow deployed frontend origins and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://khetitak.in",
        "https://www.khetitak.in",
        "https://krishi-ai-sable-sigma.vercel.app",
        "https://krishi-cr87mahkb-akshat9151s-projects.vercel.app",
        "https://krishi-cr87mabkb-akshat9151s-projects.vercel.app",
        "https://krishi-ai-2-4j3k.onrender.com",
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