from fastapi import APIRouter, Request
from typing import Dict, Any
from datetime import datetime, timedelta
import time
import psutil
from services.health_check import health_checker, get_health_metrics
from services.logger import logger

router = APIRouter(prefix="/monitoring", tags=["Monitoring"])

class MetricsCollector:
    """Collect and store application metrics."""
    
    def __init__(self):
        self.request_count = 0
        self.error_count = 0
        self.response_times = []
        self.start_time = time.time()
        self.last_reset = datetime.utcnow()
    
    def record_request(self, response_time: float, status_code: int):
        """Record a request metric."""
        self.request_count += 1
        self.response_times.append(response_time)
        
        if status_code >= 400:
            self.error_count += 1
        
        # Keep only last 1000 response times
        if len(self.response_times) > 1000:
            self.response_times = self.response_times[-1000:]
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics."""
        avg_response_time = sum(self.response_times) / len(self.response_times) if self.response_times else 0
        error_rate = (self.error_count / self.request_count * 100) if self.request_count > 0 else 0
        
        return {
            "request_count": self.request_count,
            "error_count": self.error_count,
            "error_rate_percent": round(error_rate, 2),
            "avg_response_time_ms": round(avg_response_time * 1000, 2),
            "requests_per_minute": round(self.request_count / max(1, (time.time() - self.start_time) / 60), 2),
            "uptime_hours": round((time.time() - self.start_time) / 3600, 2),
            "last_reset": self.last_reset.isoformat()
        }
    
    def reset_metrics(self):
        """Reset all metrics."""
        self.request_count = 0
        self.error_count = 0
        self.response_times = []
        self.last_reset = datetime.utcnow()

# Global metrics collector
metrics = MetricsCollector()

@router.get("/health")
def health_check():
    """Basic health check endpoint."""
    return health_checker.check_liveness()

@router.get("/ready")
def readiness_check():
    """Readiness probe endpoint."""
    return health_checker.check_readiness()

@router.get("/health/detailed")
def detailed_health_check():
    """Detailed health check with all services."""
    return health_checker.get_overall_health()

@router.get("/metrics")
def get_metrics():
    """Get application metrics."""
    return {
        "metrics": metrics.get_metrics(),
        "system": get_health_metrics(),
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/metrics/reset")
def reset_metrics():
    """Reset metrics (for testing)."""
    metrics.reset_metrics()
    return {"message": "Metrics reset successfully"}

@router.get("/status")
def get_status():
    """Get comprehensive application status."""
    return {
        "status": "operational",
        "health": health_checker.get_overall_health(),
        "metrics": metrics.get_metrics(),
        "system": {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Middleware to collect metrics
async def metrics_middleware(request: Request, call_next):
    """Middleware to collect request metrics."""
    start_time = time.time()
    
    response = await call_next(request)
    
    response_time = time.time() - start_time
    metrics.record_request(response_time, response.status_code)
    
    return response
