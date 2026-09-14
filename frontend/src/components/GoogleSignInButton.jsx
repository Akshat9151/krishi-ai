import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function GoogleSignInButton({ onSuccess, variant = "login" }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const buttonContainerRef = useRef(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || isInitializing.current) return;

    isInitializing.current = true;

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render button if container exists
      if (buttonContainerRef.current) {
        window.google.accounts.id.renderButton(
          buttonContainerRef.current,
          {
            theme: "outline",
            size: "large",
            width: "100%",
            type: "standard",
            text: variant === "login" ? "signin_with" : "signup_with",
          }
        );
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      setError("Google authentication failed. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8000";
      const apiResponse = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.detail || errorData.message || "Google sign-in failed"
        );
      }

      const data = await apiResponse.json();

      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Update auth context
      const username = data.user?.username || data.user?.email || "user";
      await login(username, "");

      // Call success callback
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    return null; // Don't render if client ID not configured
  }

  return (
    <div style={{ marginTop: "12px" }}>
      {error && (
        <div
          style={{
            color: "#dc2626",
            fontSize: "13px",
            marginBottom: "12px",
            textAlign: "center",
            padding: "8px 12px",
            backgroundColor: "#fee2e2",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      {/* Google Sign-In Button Container */}
      <div
        ref={buttonContainerRef}
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "44px",
        }}
      />

      {/* Fallback message if Google doesn't load */}
      {typeof window === "undefined" || !window.google?.accounts?.id && (
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            textAlign: "center",
            padding: "12px",
          }}
        >
          {loading ? "Signing in with Google..." : "Google Sign-In loading..."}
        </div>
      )}
    </div>
  );
}

