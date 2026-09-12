import React, { useState } from "react";
import { Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";

export default function Login({ onSwitchToRegister, onLoginSuccess, onGuestContinue }) {
  const { login } = useAuth();
  const { language, setLanguage, languages, t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(username.trim(), password.trim());
      setSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Preserved animated background pattern */}
      <div className="bg-pattern" />

      {/* Preserved floating leaves decoration */}
      <div className="leaf-decoration" style={{ top: "10%", left: "5%", fontSize: "60px" }}>🍃</div>
      <div className="leaf-decoration" style={{ top: "20%", right: "10%", fontSize: "40px", animationDelay: "1s" }}>🌿</div>
      <div className="leaf-decoration" style={{ bottom: "20%", left: "15%", fontSize: "50px", animationDelay: "2s" }}>🌱</div>
      <div className="leaf-decoration" style={{ bottom: "10%", right: "8%", fontSize: "30px", animationDelay: "0.5s" }}>🍂</div>

      {/* Login Card */}
      <div
        className="ka-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "36px 32px",
          backgroundColor: "#FFFFFF",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 10px 30px rgba(43, 33, 24, 0.08)",
        }}
      >
        {/* Language selector in card header */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "var(--bg-cream)",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius-sm)",
              padding: "3px 7px",
            }}
          >
            <Globe size={13} color="var(--growth-green)" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Language"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Brand & Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 12px auto",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--growth-green), var(--marigold))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              boxShadow: "0 4px 12px rgba(76, 122, 58, 0.25)",
            }}
          >
            🌱
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "4px" }}>
            {t("welcomeKrishi", "Welcome to Krishi AI")}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            {t("loginTagline", "Your Smart Agriculture Assistant")}
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              backgroundColor: "var(--terracotta-light)",
              color: "var(--terracotta)",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              backgroundColor: "var(--growth-green-light)",
              color: "var(--growth-green)",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            <CheckCircle2 size={16} />
            <span>{t("loginSuccess", "Login successful! Redirecting...")}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="input-label">{t("username", "Username")}</label>
            <div style={{ position: "relative" }}>
              <User size={17} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
              <input
                type="text"
                className="input-field"
                placeholder={t("usernamePlaceholder", "Enter your username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">{t("password", "Password")}</label>
            <div style={{ position: "relative" }}>
              <Lock size={17} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
              <input
                type="password"
                className="input-field"
                placeholder={t("passwordPlaceholder", "Enter your password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "12px", marginTop: "6px" }}
            disabled={loading}
          >
            <span>{loading ? "Logging in..." : t("loginBtn", "Login to Your Farm")}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {loading && <div className="growing-bar" />}

        {/* Link to Register */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
          <span>{t("newToKrishi", "New to Krishi AI?")} </span>
          <button
            onClick={onSwitchToRegister}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--terracotta)",
              fontWeight: "700",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {t("createAccount", "Create an account")} →
          </button>
        </div>

        {/* Continue as Guest option */}
        {onGuestContinue && (
          <div style={{ textAlign: "center", marginTop: "14px" }}>
            <button
              type="button"
              onClick={onGuestContinue}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "12.5px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Continue as Guest Farmer (बिना लॉगिन देखें)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
