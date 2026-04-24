import psutil
import time
from datetime import datetime
from typing import Dict, Any
from fastapi import HTTPException
import requests
from sqlalchemy import text
from backend.database import SessionLocal
from services.logger import logger

class HealthChecker:
    """Comprehensive health checking system for Krishi AI."""
    
    def __init__(self):
        self.start_time = time.time()
    
    def check_database_health(self) -> Dict[str, Any]:
        """Check database connectivity and performance."""
        try:
            db = SessionLocal()
            start_time = time.time()
            
            # Simple connectivity test
            result = db.execute(text("SELECT 1"))
            db.close()
            
            query_time = time.time() - start_time
            
            return {
                "status": "healthy",
                "response_time_ms": round(query_time * 1000, 2),
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.log_error(e, "Database Health Check")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def check_weather_api_health(self) -> Dict[str, Any]:
        """Check weather API availability."""
        try:
            start_time = time.time()
            response = requests.get(
                "https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m",
                timeout=5
            )
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                return {
                    "status": "healthy",
                    "response_time_ms": round(response_time * 1000, 2),
                    "timestamp": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "unhealthy",
                    "error": f"HTTP {response.status_code}",
                    "timestamp": datetime.utcnow().isoformat()
                }
        except Exception as e:
            logger.log_error(e, "Weather API Health Check")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def check_ml_model_health(self) -> Dict[str, Any]:
        """Check ML model availability."""
        try:
            import joblib
            start_time = time.time()
            
            # Try to load the model
            model = joblib.load("services/crop_model.pkl")
            load_time = time.time() - start_time
            
            return {
                "status": "healthy",
                "load_time_ms": round(load_time * 1000, 2),
                "model_type": type(model).__name__,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.log_error(e, "ML Model Health Check")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def check_system_resources(self) -> Dict[str, Any]:
        """Check system resources."""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                "status": "healthy",
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2),
                "disk_percent": disk.percent,
                "disk_free_gb": round(disk.free / (1024**3), 2),
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.log_error(e, "System Resources Health Check")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def get_uptime(self) -> Dict[str, Any]:
        """Get application uptime."""
        uptime_seconds = time.time() - self.start_time
        uptime_hours = uptime_seconds / 3600
        uptime_days = uptime_hours / 24
        
        return {
            "uptime_seconds": round(uptime_seconds, 2),
            "uptime_hours": round(uptime_hours, 2),
            "uptime_days": round(uptime_days, 2),
            "start_time": datetime.fromtimestamp(self.start_time).isoformat(),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def get_overall_health(self) -> Dict[str, Any]:
        """Get overall system health status."""
        checks = {
            "database": self.check_database_health(),
            "weather_api": self.check_weather_api_health(),
            "ml_model": self.check_ml_model_health(),
            "system_resources": self.check_system_resources(),
            "uptime": self.get_uptime()
        }
        
        # Determine overall status
        unhealthy_services = [
            service for service, health in checks.items() 
            if health.get("status") == "unhealthy"
        ]
        
        overall_status = "healthy" if not unhealthy_services else "degraded"
        if len(unhealthy_services) >= 2:
            overall_status = "unhealthy"
        
        return {
            "overall_status": overall_status,
            "unhealthy_services": unhealthy_services,
            "checks": checks,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def check_readiness(self) -> Dict[str, Any]:
        """Check if the application is ready to serve traffic."""
        # Critical services that must be healthy
        critical_checks = {
            "database": self.check_database_health()
        }
        
        unhealthy_critical = [
            service for service, health in critical_checks.items() 
            if health.get("status") == "unhealthy"
        ]
        
        return {
            "ready": len(unhealthy_critical) == 0,
            "critical_checks": critical_checks,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def check_liveness(self) -> Dict[str, Any]:
        """Check if the application is alive."""
        return {
            "alive": True,
            "uptime": self.get_uptime(),
            "timestamp": datetime.utcnow().isoformat()
        }

# Global health checker instance
health_checker = HealthChecker()

def get_health_metrics() -> Dict[str, Any]:
    """Get detailed health metrics for monitoring."""
    return {
        "application": {
            "name": "Krishi AI",
            "version": "1.0.0",
            "environment": "production" if psutil.cpu_count() > 2 else "development"
        },
        "system": health_checker.check_system_resources(),
        "database": health_checker.check_database_health(),
        "external_apis": {
            "weather": health_checker.check_weather_api_health()
        },
        "ml_models": {
            "crop_prediction": health_checker.check_ml_model_health()
        },
        "uptime": health_checker.get_uptime(),
        "timestamp": datetime.utcnow().isoformat()
    }
