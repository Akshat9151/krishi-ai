import React, { useState } from "react";
import { Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Globe, Store, Bike } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { KhetiTakMark, KhetiTakLogo } from "../components/KhetiTakBranding";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login({ onSwitchToRegister, onLoginSuccess, onNavigateShopLogin, onNavigateRiderLogin }) {
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
      const res = await login(username.trim(), password.trim());
      setSuccess(true);
      setTimeout(() => {
        if (res?.role === "shop_owner") {
          if (onNavigateShopLogin) onNavigateShopLogin();
          else window.location.hash = "shop-dashboard";
        } else if (res?.role === "rider") {
          if (onNavigateRiderLogin) onNavigateRiderLogin();
          else window.location.hash = "rider-dashboard";
        } else {
          if (onLoginSuccess) onLoginSuccess();
          else window.location.hash = "dashboard";
        }
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
        className="ka-card auth-card"
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

        {/* Brand & Logo — Concept 2 Grain K */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <KhetiTakMark size={64} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
            <span style={{ color: "#2B2118" }}>Kheti</span>
            <span style={{ color: "#E8A33D" }}>Tak</span>
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, fontWeight: "500" }}>
            खेती का भरोसा, आपके पास
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

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0", opacity: 0.5 }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--card-border)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("or", "or")}</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--card-border)" }} />
        </div>

        {/* Google Sign-In Button */}
        <GoogleSignInButton onSuccess={onLoginSuccess} variant="login" />

        {loading && <div className="growing-bar" />}

        {/* Link to Register */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
          <span>{t("newToKrishi", "New to KhetiTak?")} </span>
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

        {/* Dedicated Partner Access Section */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px dashed var(--card-border)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
            KhetiTak Partner Portals
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <button
              type="button"
              onClick={() => {
                if (onNavigateShopLogin) onNavigateShopLogin();
                else window.location.hash = "shop-login";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--card-border)",
                background: "var(--bg-cream)",
                color: "var(--text-primary)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--marigold)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
            >
              <Store size={14} color="var(--terracotta)" />
              <span>Shop / Agency</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateRiderLogin) onNavigateRiderLogin();
                else window.location.hash = "rider-login";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--card-border)",
                background: "var(--bg-cream)",
                color: "var(--text-primary)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--marigold)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
            >
              <Bike size={14} color="var(--growth-green)" />
              <span>Delivery Rider</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

