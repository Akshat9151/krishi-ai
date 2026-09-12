import React, { useState } from "react";
import { Lock, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(username.trim(), password.trim());
      setSuccess(true);
      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. User may already exist.");
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

      {/* Register Card */}
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
            Create Farmer Account
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            Join Krishi AI Smart Farming Network (नया खाता बनाएं)
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
            <span>Account created! Redirecting to login...</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="input-label">Username (उपयोगकर्ता नाम)</label>
            <div style={{ position: "relative" }}>
              <User size={17} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
              <input
                type="text"
                className="input-field"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Password (पासवर्ड - कम से कम 6 अक्षर)</label>
            <div style={{ position: "relative" }}>
              <Lock size={17} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
              <input
                type="password"
                className="input-field"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Confirm Password (पासवर्ड दोबारा लिखें)</label>
            <div style={{ position: "relative" }}>
              <Lock size={17} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
              <input
                type="password"
                className="input-field"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "12px", marginTop: "8px" }}
            disabled={loading}
          >
            <span>{loading ? "Creating Account..." : "Register Now (खाता बनाएं)"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {loading && <div className="growing-bar" />}

        {/* Link to Login */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
          <span>Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--terracotta)",
              fontWeight: "700",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sign In here (लॉगिन करें) →
          </button>
        </div>
      </div>
    </div>
  );
}
