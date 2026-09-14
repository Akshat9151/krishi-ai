from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from services.config import settings

DATABASE_URL = settings.DATABASE_SYNC_URL or settings.DATABASE_URL
ASYNC_DATABASE_URL = settings.DATABASE_URL

sync_engine_kwargs = {"pool_pre_ping": True, "future": True}
if DATABASE_URL.startswith("sqlite"):
    sync_engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    sync_engine_kwargs.update({"pool_size": settings.DB_POOL_SIZE, "max_overflow": settings.DB_MAX_OVERFLOW, "pool_timeout": settings.DB_POOL_TIMEOUT})

engine = create_engine(DATABASE_URL, **sync_engine_kwargs)

async_engine_kwargs = {"pool_pre_ping": True, "future": True}
if not ASYNC_DATABASE_URL.startswith("sqlite"):
    async_engine_kwargs["connect_args"] = {"statement_cache_size": 0, "prepared_statement_cache_size": 0, "command_timeout": 30}
async_engine = create_async_engine(ASYNC_DATABASE_URL, **async_engine_kwargs)
AsyncSessionLocal = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
            await db.commit()
        except Exception:
            await db.rollback()
            raise