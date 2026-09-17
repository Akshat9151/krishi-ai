import React, { useState } from "react";
import { BriefcaseBusiness, Bike, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";

const roles = {
  shop_owner: {
    label: "Shopkeeper",
    description: "Manage incoming orders, inventory and shop earnings.",
    icon: BriefcaseBusiness,
  },
  rider: {
    label: "Delivery Rider",
    description: "Claim ready orders and update delivery status.",
    icon: Bike,
  },
};

export default function StaffLogin({ onBackToFarmerLogin, onLoginSuccess }) {
  const { login, logout } = useAuth();
  const { language, setLanguage, languages } = useTranslation();
  const [selectedRole, setSelectedRole] = useState("shop_owner");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your login and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await login(identifier.trim(), password);
      if (data.role !== selectedRole) {
        logout();
        throw new Error(`This account is not registered as a ${roles[selectedRole].label}.`);
      }
      onLoginSuccess?.();
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-cream)", display: "flex", flexDirection: "column" }}>
      <main className="page-container" style={{ width: "100%", maxWidth: "520px", margin: "0 auto", flex: 1, display: "flex", alignItems: "center" }}>
        <div className="ka-card" style={{ width: "100%", padding: "28px" }}>
          <h1 style={{ marginTop: 0, color: "var(--text-primary)" }}>KhetiTak Partner Login</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Choose your work profile to continue.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "20px 0" }}>
            {Object.entries(roles).map(([key, role]) => {
              const Icon = role.icon;
              const active = selectedRole === key;
              return (
                <button type="button" key={key} onClick={() => { setSelectedRole(key); setError(""); }} className={active ? "btn-primary" : "btn-outline"} style={{ minHeight: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                  <Icon size={22} />
                  <strong>{role.label}</strong>
                  <small style={{ opacity: 0.8 }}>{role.description}</small>
                </button>
              );
            })}
          </div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label className="input-label"><User size={14} /> Email, username or phone</label>
            <input className="input-field" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" />
            <label className="input-label"><Lock size={14} /> Password</label>
            <input className="input-field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            {error && <div role="alert" style={{ color: "var(--terracotta)", fontSize: "13px" }}>{error}</div>}
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : `Continue as ${roles[selectedRole].label}`}</button>
          </form>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" className="btn-outline" onClick={onBackToFarmerLogin}>Farmer login</button>
            <select className="input-field" value={language} onChange={(event) => setLanguage(event.target.value)} style={{ width: "130px" }}>
              {languages.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.name}</option>)}
            </select>
          </div>
        </div>
      </main>
      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", padding: "14px" }}>Partner access is granted only to accounts approved by KhetiTak.</p>
    </div>
  );
}
