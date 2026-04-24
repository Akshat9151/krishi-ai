from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException, status
import redis
from typing import Optional
import time

# Redis client for distributed rate limiting
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()  # Test connection
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False
    print("⚠️ Redis not available, using in-memory rate limiting")

# Initialize rate limiter
def get_identifier(request: Request) -> str:
    """Get unique identifier for rate limiting."""
    # Try to get user ID from JWT token first, fallback to IP
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        # In production, you'd decode the JWT to get user ID
        # For now, use the token as identifier
        return f"token:{auth_header[:20]}"
    return f"ip:{get_remote_address(request)}"

# Create limiter instance
limiter = Limiter(key_func=get_identifier)

# Custom rate limit exceeded handler
async def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Custom handler for rate limit exceeded."""
    return HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail={
            "error": "Rate limit exceeded",
            "message": f"Too many requests. Try again in {exc.detail.split(' ')[-1]}",
            "retry_after": str(int(time.time()) + 60)  # 1 minute retry
        }
    )

class RateLimitConfig:
    """Rate limiting configurations for different endpoints."""
    
    # Authentication endpoints - stricter limits
    AUTH = "5/minute"
    
    # General API endpoints
    GENERAL = "100/minute"
    
    # ML prediction endpoints - moderate limits
    ML_PREDICTION = "30/minute"
    
    # Weather API - external service dependency
    WEATHER = "20/minute"
    
    # AI Assistant - resource intensive
    AI_ASSISTANT = "10/minute"

class DistributedRateLimiter:
    """Distributed rate limiter using Redis or fallback to memory."""
    
    def __init__(self):
        self.memory_store = {}  # Fallback when Redis is not available
    
    def is_allowed(self, key: str, limit: int, window: int) -> tuple[bool, dict]:
        """
        Check if request is allowed based on rate limit.
        
        Args:
            key: Unique identifier (IP, user ID, etc.)
            limit: Number of requests allowed
            window: Time window in seconds
        
        Returns:
            tuple[bool, dict]: (is_allowed, rate_limit_info)
        """
        current_time = int(time.time())
        window_start = current_time - window
        
        if REDIS_AVAILABLE:
            return self._redis_check(key, limit, window, current_time, window_start)
        else:
            return self._memory_check(key, limit, window, current_time, window_start)
    
    def _redis_check(self, key: str, limit: int, window: int, current_time: int, window_start: int) -> tuple[bool, dict]:
        """Check rate limit using Redis."""
        pipe = redis_client.pipeline()
        
        # Remove old entries
        pipe.zremrangebyscore(key, 0, window_start)
        
        # Count current requests
        pipe.zcard(key)
        
        # Add current request
        pipe.zadd(key, {str(current_time): current_time})
        
        # Set expiry
        pipe.expire(key, window)
        
        results = pipe.execute()
        current_requests = results[1]
        
        is_allowed = current_requests < limit
        reset_time = current_time + window
        
        return is_allowed, {
            "limit": limit,
            "remaining": max(0, limit - current_requests - 1),
            "reset": reset_time
        }
    
    def _memory_check(self, key: str, limit: int, window: int, current_time: int, window_start: int) -> tuple[bool, dict]:
        """Check rate limit using in-memory storage."""
        if key not in self.memory_store:
            self.memory_store[key] = []
        
        # Remove old entries
        self.memory_store[key] = [
            timestamp for timestamp in self.memory_store[key]
            if timestamp > window_start
        ]
        
        current_requests = len(self.memory_store[key])
        is_allowed = current_requests < limit
        
        if is_allowed:
            self.memory_store[key].append(current_time)
        
        # Clean up old keys
        if current_time % 300 == 0:  # Every 5 minutes
            self._cleanup_memory_store(current_time - 3600)  # Remove 1 hour old keys
        
        reset_time = current_time + window
        
        return is_allowed, {
            "limit": limit,
            "remaining": max(0, limit - current_requests - 1),
            "reset": reset_time
        }
    
    def _cleanup_memory_store(self, cutoff_time: int):
        """Clean up old entries from memory store."""
        keys_to_remove = []
        for key, timestamps in self.memory_store.items():
            # Remove old timestamps
            self.memory_store[key] = [
                timestamp for timestamp in timestamps
                if timestamp > cutoff_time
            ]
            
            # Remove empty keys
            if not self.memory_store[key]:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self.memory_store[key]

# Global rate limiter instance
rate_limiter = DistributedRateLimiter()

def check_rate_limit(key: str, limit_config: str) -> bool:
    """
    Check rate limit for a given key and configuration.
    
    Args:
        key: Unique identifier
        limit_config: Rate limit string (e.g., "100/minute")
    
    Returns:
        bool: True if allowed, False otherwise
    """
    limit, window = parse_limit_config(limit_config)
    is_allowed, info = rate_limiter.is_allowed(key, limit, window)
    
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate limit exceeded",
                "message": f"Rate limit of {limit} requests per {window} seconds exceeded",
                "limit_info": info
            },
            headers={
                "X-RateLimit-Limit": str(info["limit"]),
                "X-RateLimit-Remaining": str(info["remaining"]),
                "X-RateLimit-Reset": str(info["reset"]),
                "Retry-After": str(window)
            }
        )
    
    return True

def parse_limit_config(limit_config: str) -> tuple[int, int]:
    """
    Parse rate limit configuration string.
    
    Args:
        limit_config: String like "100/minute" or "5/hour"
    
    Returns:
        tuple[int, int]: (limit, window_in_seconds)
    """
    try:
        limit_str, period_str = limit_config.split('/')
        limit = int(limit_str)
        
        period_map = {
            'second': 1,
            'minute': 60,
            'hour': 3600,
            'day': 86400
        }
        
        window = period_map.get(period_str.lower(), 60)  # Default to minute
        return limit, window
    
    except:
        # Default fallback
        return 100, 60
