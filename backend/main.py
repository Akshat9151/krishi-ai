from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router
from services import auth

from backend.database import engine
from backend.models import Base

# Create FastAPI app
app = FastAPI(
    title="Krishi AI",
    description="Crop Recommendation System",
    version="1.0"
)

# Create database tables
Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)
app.include_router(auth.router)

# Root API
@app.get("/")
def home():
    return {"message": "🚀 Welcome to Krishi AI API – Crop Recommendation System"}