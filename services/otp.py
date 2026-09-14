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
    
    # Mock mode for local testing
    if settings.SMS_PROVIDER == "mock" and "@" not in destination:
        logger.info("Mock SMS OTP for %s: %s", destination, code)
        return True
    if settings.EMAIL_PROVIDER == "mock" and "@" in destination:
        logger.info("Mock email OTP for %s: %s", destination, code)
        return True

    # Email delivery
    if "@" in destination:
        if settings.EMAIL_PROVIDER == "brevo":
            return _send_brevo_email(destination, code, message)
        elif settings.EMAIL_PROVIDER == "sendgrid":
            return _send_sendgrid_email(destination, code, message)
        elif settings.EMAIL_PROVIDER == "resend":
            return _send_resend_email(destination, code, message)
        elif settings.EMAIL_PROVIDER == "smtp":
            return _send_smtp_email(destination, code, message)
        else:
            raise RuntimeError(f"Email provider '{settings.EMAIL_PROVIDER}' is not configured")

    # SMS delivery
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


def _send_smtp_email(destination: str, code: str, message: str) -> bool:
    """Send OTP via SMTP (self-hosted email)."""
    if not settings.SMTP_HOST:
        raise RuntimeError("SMTP_HOST not configured")
    
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


def _send_brevo_email(destination: str, code: str, message: str) -> bool:
    """Send OTP via Brevo (formerly Sendinblue)."""
    if not settings.BREVO_API_KEY:
        raise RuntimeError("BREVO_API_KEY not configured")
    
    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "accept": "application/json",
            "api-key": settings.BREVO_API_KEY,
            "content-type": "application/json",
        },
        json={
            "sender": {"name": "KhetiTak", "email": "noreply@khetitak.in"},
            "to": [{"email": destination}],
            "subject": "KhetiTak verification code",
            "htmlContent": f"<p>Your KhetiTak verification code is <strong>{code}</strong>.</p>"
                          f"<p>It expires in {settings.OTP_EXPIRE_MINUTES} minutes.</p>",
        },
        timeout=15,
    )
    response.raise_for_status()
    return True


def _send_sendgrid_email(destination: str, code: str, message: str) -> bool:
    """Send OTP via SendGrid."""
    if not settings.SENDGRID_API_KEY:
        raise RuntimeError("SENDGRID_API_KEY not configured")
    
    response = requests.post(
        "https://api.sendgrid.com/v3/mail/send",
        headers={
            "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "personalizations": [{"to": [{"email": destination}]}],
            "from": {"email": "noreply@khetitak.in", "name": "KhetiTak"},
            "subject": "KhetiTak verification code",
            "content": [{"type": "text/html", "value": f"<p>Your KhetiTak verification code is <strong>{code}</strong>.</p>"
                                                          f"<p>It expires in {settings.OTP_EXPIRE_MINUTES} minutes.</p>"}],
        },
        timeout=15,
    )
    response.raise_for_status()
    return True


def _send_resend_email(destination: str, code: str, message: str) -> bool:
    """Send OTP via Resend."""
    if not settings.RESEND_API_KEY:
        raise RuntimeError("RESEND_API_KEY not configured")
    
    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": "noreply@khetitak.in",
            "to": destination,
            "subject": "KhetiTak verification code",
            "html": f"<p>Your KhetiTak verification code is <strong>{code}</strong>.</p>"
                   f"<p>It expires in {settings.OTP_EXPIRE_MINUTES} minutes.</p>",
        },
        timeout=15,
    )
    response.raise_for_status()
    return True


def provider_status() -> dict:
    return {
        "sms_provider": settings.SMS_PROVIDER,
        "email_provider": settings.EMAIL_PROVIDER,
        "google_configured": bool(settings.GOOGLE_CLIENT_ID),
        "smtp_configured": bool(settings.SMTP_HOST and (settings.SMTP_USERNAME or settings.SMTP_USER)),
        "twilio_configured": bool(settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER),
        "brevo_configured": bool(settings.BREVO_API_KEY),
        "sendgrid_configured": bool(settings.SENDGRID_API_KEY),
        "resend_configured": bool(settings.RESEND_API_KEY),
    }
