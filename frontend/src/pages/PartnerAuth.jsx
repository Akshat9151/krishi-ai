import React, { useState } from "react";
import { Store, Bike, Lock, User, Phone, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { KhetiTakMark } from "../components/KhetiTakBranding";

export default function PartnerAuth({ defaultRole = "shop_owner", onBackToFarmerLogin, onLoginSuccess }) {
  const { loginPartner, registerPartner } = useAuth();

  const [role, setRole] = useState(defaultRole); // "shop_owner" or "rider"
  const [mode, setMode] = useState("login");     // "login" or "register"

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isShop = role === "shop_owner";

  const handleSwitchRole = (newRole) => {
    setRole(newRole);
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in username and password.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const res = await loginPartner(username.trim(), password.trim(), role);
        setSuccessMsg(`Welcome back! Logged in as ${isShop ? "Shop Owner" : "Rider"}.`);
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(res?.role || role);
          } else {
            window.location.hash = isShop ? "shop-dashboard" : "rider-dashboard";
          }
        }, 600);
      } else {
        // Register mode
        await registerPartner({
          username: username.trim(),
          password: password.trim(),
          role,
          phone: phone.trim() || undefined,
          full_name: fullName.trim() || undefined,
        });

        // Automatically log in after registration
        setSuccessMsg("Partner registration successful! Logging you in...");
        const res = await loginPartner(username.trim(), password.trim(), role);
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(res?.role || role);
          } else {
            window.location.hash = isShop ? "shop-dashboard" : "rider-dashboard";
          }
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed. Please verify credentials.");
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
        backgroundColor: "var(--bg-cream)",
        position: "relative",
      }}
    >
      <div
        className="ka-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "32px 28px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 12px 36px rgba(43, 33, 24, 0.08)",
          borderRadius: "var(--radius-md)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Back link */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={onBackToFarmerLogin || (() => (window.location.hash = "home"))}
            style={{
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: "600",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to KhetiTak</span>
          </button>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "var(--terracotta)",
              backgroundColor: "rgba(196, 92, 53, 0.12)",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <ShieldCheck size={13} />
            {isShop ? "Shop Partner Portal" : "Rider Partner Portal"}
          </span>
        </div>

        {/* Portal Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "rgba(196, 92, 53, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--terracotta)",
              }}
            >
              {isShop ? <Store size={28} /> : <Bike size={28} />}
            </div>
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "800", color: "var(--soil-dark, #24201D)", margin: "0 0 6px" }}>
            {isShop ? "Shop & Agency Partner Portal" : "Delivery Partner Fleet Portal"}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary, #524B42)", margin: 0, lineHeight: 1.4 }}>
            {isShop
              ? "Manage incoming farmer orders, package preparations & mandi store inventory."
              : "Accept village deliveries, navigate farm drops & track earnings per trip."}
          </p>
        </div>

        {/* Mode Switch: Login vs Register */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--card-border)", marginBottom: "18px" }}>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            style={{
              flex: 1,
              padding: "10px 8px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: mode === "login" ? "700" : "500",
              color: mode === "login" ? "var(--terracotta)" : "var(--text-muted)",
              borderBottom: mode === "login" ? "2px solid var(--terracotta)" : "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Partner Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); }}
            style={{
              flex: 1,
              padding: "10px 8px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: mode === "register" ? "700" : "500",
              color: mode === "register" ? "var(--terracotta)" : "var(--text-muted)",
              borderBottom: mode === "register" ? "2px solid var(--terracotta)" : "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            New Partner Registration
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              padding: "10px 12px",
              backgroundColor: "var(--terracotta-light)",
              color: "var(--terracotta)",
              borderRadius: "var(--radius-sm)",
              fontSize: "12.5px",
              marginBottom: "16px",
              lineHeight: "1.4",
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              backgroundColor: "var(--growth-green-light)",
              color: "var(--growth-green)",
              borderRadius: "var(--radius-sm)",
              fontSize: "12.5px",
              marginBottom: "16px",
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "register" && (
            <div>
              <label className="input-label">{isShop ? "Shop / Agency Name" : "Rider Full Name"}</label>
              <input
                type="text"
                className="input-field"
                placeholder={isShop ? "e.g. Kisan Seva Kendra Jaipur" : "e.g. Rahul Sharma"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="input-label">Partner Username / ID</label>
            <div style={{ position: "relative" }}>
              <User size={16} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
              <input
                type="text"
                className="input-field"
                placeholder={isShop ? "shop_jaipur_01" : "rider_rahul"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: "36px" }}
                required
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="input-label">Mobile Number</label>
              <div style={{ position: "relative" }}>
                <Phone size={16} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
                <input
                  type="tel"
                  className="input-field"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: "36px" }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
              <input
                type="password"
                className="input-field"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "36px" }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              backgroundColor: "var(--terracotta)",
              borderColor: "var(--terracotta)",
            }}
          >
            <span>
              {loading
                ? "Verifying..."
                : mode === "login"
                ? `Log in as ${isShop ? "Shop Owner" : "Delivery Rider"}`
                : `Register as ${isShop ? "Shop Owner" : "Delivery Rider"}`}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo hints */}
        <div
          style={{
            marginTop: "18px",
            padding: "10px 12px",
            backgroundColor: "var(--bg-cream)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--card-border)",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          💡 <strong>Tip:</strong> You can register a new {isShop ? "shop" : "rider"} account instantly using the "New Partner Registration" tab above.
        </div>
      </div>
    </div>
  );
}
