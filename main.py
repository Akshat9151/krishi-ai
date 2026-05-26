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

from backend.database import engine
from backend.models import Base

# Create FastAPI app
app = FastAPI(
    title="Krishi AI",
    description="Crop Recommendation System",
    version="1.0"
)

# Set up rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"❌ Error creating database tables: {e}")

# CORS middleware - Allow deployed frontend origins and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://krishi-ai-sable-sigma.vercel.app",
        "https://krishi-ai-2-4j3k.onrender.com",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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
    return {"message": "🚀 Welcome to Krishi AI API – Crop Recommendation System"}