import re
from typing import Optional
from fastapi import HTTPException, status

class ValidationUtils:
    @staticmethod
    def sanitize_string(input_string: str, max_length: int = 255) -> str:
        """Sanitize string input by removing potentially harmful characters."""
        if not input_string:
            return ""
        
        # Remove HTML tags and scripts
        sanitized = re.sub(r'<script.*?>.*?</script>', '', input_string, flags=re.IGNORECASE | re.DOTALL)
        sanitized = re.sub(r'<[^>]+>', '', sanitized)
        
        # Remove SQL injection patterns
        sanitized = re.sub(r'(?i)(union|select|insert|update|delete|drop|alter|exec|script)', '', sanitized)
        
        # Limit length
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized.strip()
    
    @staticmethod
    def validate_username(username: str) -> str:
        """Validate username format."""
        if not username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username is required"
            )
        
        username = username.strip()
        
        if len(username) < 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username must be at least 3 characters long"
            )
        
        if len(username) > 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username must be less than 50 characters"
            )
        
        # Only allow alphanumeric, underscore, and hyphen
        if not re.match(r'^[a-zA-Z0-9_-]+$', username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username can only contain letters, numbers, underscore, and hyphen"
            )
        
        return ValidationUtils.sanitize_string(username, 50)
    
    @staticmethod
    def validate_password(password: str) -> str:
        """Validate password strength."""
        if not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required"
            )
        
        if len(password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 6 characters long"
            )
        
        if len(password) > 128:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be less than 128 characters"
            )
        
        return password
    
    @staticmethod
    def validate_location(location: str) -> str:
        """Validate location/city name."""
        if not location:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location is required"
            )
        
        location = location.strip()
        
        if len(location) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location must be at least 2 characters long"
            )
        
        if len(location) > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location must be less than 100 characters"
            )
        
        # Allow letters, spaces, hyphens, and apostrophes
        if not re.match(r'^[a-zA-Z\s\-\'\.]+$', location):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location can only contain letters, spaces, hyphens, and apostrophes"
            )
        
        return ValidationUtils.sanitize_string(location, 100)
    
    @staticmethod
    def validate_soil_type(soil_type: str) -> str:
        """Validate soil type."""
        valid_soils = [
            "clay", "sandy", "loamy", "silty", "peaty", "chalky", "black", "red", 
            "alluvial", "laterite", "forest", "desert", "mountain"
        ]
        
        if not soil_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Soil type is required"
            )
        
        soil_type = soil_type.strip().lower()
        
        if soil_type not in valid_soils:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid soil type. Valid options: {', '.join(valid_soils)}"
            )
        
        return soil_type
    
    @staticmethod
    def validate_season(season: str) -> str:
        """Validate season."""
        valid_seasons = ["spring", "summer", "monsoon", "autumn", "winter", "kharif", "rabi", "zaid"]
        
        if not season:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Season is required"
            )
        
        season = season.strip().lower()
        
        if season not in valid_seasons:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid season. Valid options: {', '.join(valid_seasons)}"
            )
        
        return season
    
    @staticmethod
    def validate_crop_name(crop: str) -> str:
        """Validate crop name."""
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Crop name is required"
            )
        
        crop = crop.strip()
        
        if len(crop) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Crop name must be at least 2 characters long"
            )
        
        if len(crop) > 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Crop name must be less than 50 characters"
            )
        
        # Allow letters, spaces, and common agricultural terms
        if not re.match(r'^[a-zA-Z\s\-]+$', crop):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Crop name can only contain letters, spaces, and hyphens"
            )
        
        return ValidationUtils.sanitize_string(crop, 50)
    
    @staticmethod
    def validate_message(message: str, max_length: int = 1000) -> str:
        """Validate user message for AI assistant."""
        if not message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message is required"
            )
        
        message = message.strip()
        
        if len(message) < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        if len(message) > max_length:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Message must be less than {max_length} characters"
            )
        
        return ValidationUtils.sanitize_string(message, max_length)
