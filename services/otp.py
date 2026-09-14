import logging
import smtplib
from email.message import EmailMessage
from typing import Optional

import requests

from services.config import settings

logger = logging.getLogger("khetitak.auth.providers")


def send_otp(destination: str, code: str) -> bool:
    """Deliver OTP through the configured provider; mock mode is safe for local tests."""
    message = f"Your KhetiTak verification code is {code}. It expires in {settings.OTP_EXPIRE_MINUTES} minutes."
    if settings.SMS_PROVIDER == "mock" and "@" not in destination:
        logger.info("Mock SMS OTP for %s: %s", destination, code)
        return True
    if settings.EMAIL_PROVIDER == "mock" and "@" in destination:
        logger.info("Mock email OTP for %s: %s", destination, code)
        return True

    if "@" in destination:
        if settings.EMAIL_PROVIDER != "smtp" or not settings.SMTP_HOST:
            raise RuntimeError("Email provider is not configured")
        email = EmailMessage()
        email["Subject"] = "KhetiTak verification code"
        email["From"] = settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME or "noreply@khetitak.in"
        email["To"] = destination
        email.set_content(message)
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(email)
        return True

    if settings.SMS_PROVIDER == "twilio":
        response = requests.post(
            f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json",
            auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
            data={"To": destination, "From": settings.TWILIO_FROM_NUMBER, "Body": message},
            timeout=15,
        )
        response.raise_for_status()
        return True

    raise RuntimeError("SMS provider is not configured")


def provider_status() -> dict:
    return {
        "sms_provider": settings.SMS_PROVIDER,
        "email_provider": settings.EMAIL_PROVIDER,
        "google_configured": bool(settings.GOOGLE_CLIENT_ID),
        "smtp_configured": bool(settings.SMTP_HOST and (settings.SMTP_USERNAME or settings.SMTP_USER)),
        "twilio_configured": bool(settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER),
    }
