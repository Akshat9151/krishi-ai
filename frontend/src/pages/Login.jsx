import React, { useState } from "react";
import Footer from "../components/Footer";
import { Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import { useTranslation } from "../context/LanguageContext";
import { KhetiTakMark, KhetiTakLogo } from "../components/KhetiTakBranding";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login({ onSwitchToRegister, onLoginSuccess }) {
  const { login, loginWithToken } = useAuth();
  const { language, setLanguage, languages, t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState("request");
  const [recoveryIdentifier, setRecoveryIdentifier] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryChallenge, setRecoveryChallenge] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpChallenge, setOtpChallenge] = useState("");
  const [otpCode, setOtpCode] = useState("");

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

  const requestRecoveryOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authApi.requestPasswordResetOtp(recoveryIdentifier.trim());
      setRecoveryChallenge(data.challenge_id);
      setRecoveryStep("verify");
      setSuccess(false);
    } catch (err) {
      setError(err.message || "Could not send reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetAccountPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authApi.resetPassword({
        challenge_id: recoveryChallenge,
        code: recoveryCode.trim(),
        new_password: newPassword,
      });
      setRecovery(false);
      setRecoveryStep("request");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  const requestLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authApi.requestLoginOtp({ identifier: username.trim(), password });
      setOtpChallenge(data.challenge_id);
      setSuccess(data.dev_code ? `OTP sent. Development OTP: ${data.dev_code}` : "OTP sent successfully.");
    } catch (err) {
      setError(err.message || "Could not send login OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authApi.verifyLoginOtp({ challenge_id: otpChallenge, code: otpCode.trim() });
      loginWithToken(username.trim(), data.access_token, data.role);
      if (data.refresh_token) localStorage.setItem("refreshToken", data.refresh_token);
      setSuccess("OTP verified. Redirecting...");
      setTimeout(() => onLoginSuccess?.(), 300);
    } catch (err) {
      setError(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

        {recovery ? (
          <form onSubmit={recoveryStep === "request" ? requestRecoveryOtp : resetAccountPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recoveryStep === "request" ? (
              <>
                <h3>Reset your password</h3>
                <input className="input-field" placeholder="Username, email or phone" value={recoveryIdentifier} onChange={(e) => setRecoveryIdentifier(e.target.value)} required />
                <button className="btn-primary" disabled={loading}>{loading ? "Sending OTP..." : "Send reset OTP"}</button>
              </>
            ) : (
              <>
                <h3>Enter OTP and new password</h3>
                <input className="input-field" inputMode="numeric" placeholder="6-digit OTP" value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)} required />
                <input className="input-field" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
                <button className="btn-primary" disabled={loading}>{loading ? "Updating..." : "Update password"}</button>
              </>
            )}
            <button type="button" className="btn-outline" onClick={() => { setRecovery(false); setError(""); }}>Back to login</button>
          </form>
        ) : (<>
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
        <button type="button" onClick={() => { setOtpMode(!otpMode); setOtpChallenge(""); setError(""); }} style={{ alignSelf: "center", background: "transparent", border: "none", color: "var(--growth-green)", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
          {otpMode ? "Use password login" : "Login with OTP"}
        </button>
        {otpMode && (
          <form onSubmit={otpChallenge ? verifyLoginOtp : requestLoginOtp} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            <input className="input-field" placeholder="Username, email or phone" value={username} onChange={(e) => setUsername(e.target.value)} required />
            {!otpChallenge && <input className="input-field" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />}
            {otpChallenge && <input className="input-field" inputMode="numeric" placeholder="6-digit OTP" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} minLength={6} maxLength={6} required />}
            <button className="btn-secondary" disabled={loading}>{loading ? "Please wait..." : otpChallenge ? "Verify OTP" : "Send Login OTP"}</button>
          </form>
        )}
        <button type="button" onClick={() => { setRecovery(true); setError(""); setSuccess(false); }} style={{ alignSelf: "flex-end", background: "transparent", border: "none", color: "var(--terracotta)", cursor: "pointer", fontSize: "12px" }}>
          Forgot password?
        </button>

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
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
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
        </>)}

      </div>
    </div>
    <Footer />
    </>
  );
}
