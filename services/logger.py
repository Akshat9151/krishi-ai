import logging
import sys
from datetime import datetime
from typing import Optional
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import traceback

class KrishiLogger:
    def __init__(self):
        self.setup_logging()
    
    def setup_logging(self):
        """Setup comprehensive logging configuration."""
        # Create formatters
        detailed_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        
        simple_formatter = logging.Formatter(
            '%(levelname)s: %(message)s'
        )
        
        # File handler for detailed logs
        file_handler = logging.FileHandler('krishi_ai.log')
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(detailed_formatter)
        
        # Console handler for important logs
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.WARNING)
        console_handler.setFormatter(simple_formatter)
        
        # Error file handler
        error_handler = logging.FileHandler('krishi_ai_errors.log')
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(detailed_formatter)
        
        # Configure root logger
        logging.basicConfig(
            level=logging.INFO,
            handlers=[file_handler, console_handler, error_handler]
        )
        
        # Create specific loggers
        self.auth_logger = logging.getLogger('krishi.auth')
        self.api_logger = logging.getLogger('krishi.api')
        self.db_logger = logging.getLogger('krishi.database')
        self.ml_logger = logging.getLogger('krishi.ml')
        self.weather_logger = logging.getLogger('krishi.weather')
    
    def log_api_request(self, request: Request, user: Optional[str] = None):
        """Log API requests."""
        client_ip = request.client.host if request.client else "unknown"
        method = request.method
        url = str(request.url)
        
        self.api_logger.info(
            f"API Request - {method} {url} - IP: {client_ip} - User: {user or 'anonymous'}"
        )
    
    def log_api_response(self, request: Request, status_code: int, response_time: float):
        """Log API responses."""
        url = str(request.url)
        self.api_logger.info(
            f"API Response - {url} - Status: {status_code} - Time: {response_time:.2f}s"
        )
    
    def log_auth_event(self, event: str, username: str, success: bool, ip: str = None):
        """Log authentication events."""
        status = "SUCCESS" if success else "FAILED"
        self.auth_logger.warning(
            f"AUTH {event} - User: {username} - Status: {status} - IP: {ip or 'unknown'}"
        )
    
    def log_database_operation(self, operation: str, table: str, success: bool, error: str = None):
        """Log database operations."""
        status = "SUCCESS" if success else "ERROR"
        message = f"DB {operation} - Table: {table} - Status: {status}"
        if error:
            message += f" - Error: {error}"
        
        if success:
            self.db_logger.info(message)
        else:
            self.db_logger.error(message)
    
    def log_ml_prediction(self, model_type: str, inputs: dict, prediction: str, confidence: float = None):
        """Log ML model predictions."""
        self.ml_logger.info(
            f"ML Prediction - Model: {model_type} - Inputs: {inputs} - Prediction: {prediction} - Confidence: {confidence}"
        )
    
    def log_weather_api_call(self, location: str, success: bool, temperature: float = None, error: str = None):
        """Log weather API calls."""
        status = "SUCCESS" if success else "ERROR"
        message = f"Weather API - Location: {location} - Status: {status}"
        if success and temperature is not None:
            message += f" - Temperature: {temperature}°C"
        if error:
            message += f" - Error: {error}"
        
        if success:
            self.weather_logger.info(message)
        else:
            self.weather_logger.error(message)
    
    def log_error(self, error: Exception, context: str = None):
        """Log errors with full traceback."""
        error_msg = f"ERROR in {context}: {str(error)}" if context else f"ERROR: {str(error)}"
        error_msg += f"\nTraceback: {traceback.format_exc()}"
        logging.error(error_msg)
    
    def log_critical_event(self, event: str, details: str = None):
        """Log critical events."""
        message = f"CRITICAL: {event}"
        if details:
            message += f" - Details: {details}"
        logging.critical(message)

# Global logger instance
logger = KrishiLogger()

async def logging_middleware(request: Request, call_next):
    """Middleware to log all API requests and responses."""
    start_time = datetime.now()
    
    # Log request
    logger.log_api_request(request)
    
    try:
        response = await call_next(request)
        
        # Calculate response time
        end_time = datetime.now()
        response_time = (end_time - start_time).total_seconds()
        
        # Log response
        logger.log_api_response(request, response.status_code, response_time)
        
        return response
    
    except Exception as e:
        # Log the error
        logger.log_error(e, "middleware")
        
        # Return JSON response for errors
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error occurred"}
        )

def handle_database_error(operation: str, table: str, error: Exception):
    """Handle and log database errors."""
    logger.log_database_operation(operation, table, False, str(error))
    raise HTTPException(
        status_code=500,
        detail=f"Database operation failed: {operation} on {table}"
    )

def handle_ml_error(error: Exception, model_type: str):
    """Handle and log ML model errors."""
    logger.log_error(error, f"ML Model - {model_type}")
    raise HTTPException(
        status_code=500,
        detail=f"Machine learning model error: {model_type}"
    )

def handle_weather_error(error: Exception, location: str):
    """Handle and log weather API errors."""
    logger.log_weather_api_call(location, False, error=str(error))
    raise HTTPException(
        status_code=503,
        detail=f"Weather service unavailable for location: {location}"
    )
