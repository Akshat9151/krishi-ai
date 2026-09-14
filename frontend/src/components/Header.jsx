import React from "react";
import { ShoppingCart, BotMessageSquare, CloudSun, User, Globe, LogIn } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { KhetiTakLogo } from "./KhetiTakBranding";

export default function Header({ currentView, setCurrentView }) {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { language, setLanguage, languages, t } = useTranslation();

  const getTitle = () => {
    switch (currentView) {
      case "dashboard": return t("dashTitle", "Farm Dashboard");
      case "crop": return t("cropRecTitle", "Crop Recommendation");
      case "disease": return t("diseaseTitle", "Plant Disease Detection");
      case "assistant": return t("assistantTitle", "KhetiTak Assistant");
      case "weather": return t("weatherTitle", "Weather & Agri-Advisory");
      case "mandi": return t("mandiTitle", "Live Mandi Bhav (Market Rates)");
      case "fertilizer": return t("fertilizerTitle", "Fertilizer Calculator");
      case "store": return t("agriStore", "AgriStore Village Market");
      case "orders": return t("ordersTitle", "My Orders");
      case "tools": return t("toolsTitle", "Farm Advisory Tools");
      case "profile": return t("profileTitle", "Profile & Settings");
      case "login": return t("signIn", "Sign In");
      case "register": return t("createAccount", "Create Account");
      default: return t("brandTitle", "KhetiTak");
    }
  };

  return (
    <header
      className="app-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid var(--card-border)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: View title + Mobile logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          onClick={() => setCurrentView("dashboard")}
          style={{
            display: "none",
            alignItems: "center",
            cursor: "pointer",
          }}
          className="mobile-brand-title"
        >
          <KhetiTakLogo size={28} />
        </div>

        <div className="desktop-view-title">
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* Right actions: Language selector, AI shortcut, Weather shortcut, Cart, Sign In / Profile */}
      <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Language Selector Dropdown */}
        <div
          className="header-language"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "var(--bg-cream)",
            border: "1px solid var(--card-border)",
            borderRadius: "var(--radius-sm)",
            padding: "4px 8px",
          }}
          title={t("langSelect", "Language")}
        >
          <Globe size={15} color="var(--growth-green)" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select Language"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "12.5px",
              fontWeight: "600",
              color: "var(--text-primary)",
              cursor: "pointer",
              padding: "2px 0",
            }}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.name} ({item.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Weather button */}
        <button
          className="header-quick-action"
          onClick={() => setCurrentView("weather")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--card-border)",
            background: "var(--bg-cream)",
            color: "var(--text-primary)",
            fontSize: "12.5px",
            fontWeight: "600",
            cursor: "pointer",
          }}
          title={t("weatherTitle", "View Weather Forecast")}
        >
          <CloudSun size={16} color="var(--marigold)" />
          <span className="hide-on-compact">{t("featWeather", "Weather")}</span>
        </button>

        {/* AI Assistant quick shortcut */}
        <button
          className="header-quick-action"
          onClick={() => setCurrentView("assistant")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--marigold)",
            background: currentView === "assistant" ? "var(--marigold)" : "var(--marigold-light)",
            color: currentView === "assistant" ? "#FFFFFF" : "var(--text-primary)",
            fontSize: "12.5px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          title={t("assistantTitle", "Chat with KhetiTak")}
        >
          <BotMessageSquare size={16} color={currentView === "assistant" ? "#FFFFFF" : "var(--terracotta)"} />
          <span className="hide-on-compact">{t("featAssistant", "Ask AI")}</span>
        </button>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--card-border)",
            background: "#FFFFFF",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
          title={t("cart", "Shopping Cart")}
        >
          <ShoppingCart size={18} color="var(--terracotta)" />
          {totalItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                backgroundColor: "var(--terracotta)",
                color: "#FFFFFF",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>

        {/* User Status / Sign In or Profile */}
        {user ? (
          <button
            onClick={() => setCurrentView("profile")}
            className="mobile-only-profile"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--card-border)",
              background: "var(--marigold-light)",
              cursor: "pointer",
              color: "var(--terracotta)",
              fontWeight: "700",
              minWidth: "38px",
            }}
            title={user.username}
          >
            {user.username.charAt(0).toUpperCase()}
          </button>
        ) : (
          <button
            onClick={() => setCurrentView("login")}
            className="btn-primary header-sign-in"
            style={{
              padding: "6px 14px",
              fontSize: "12.5px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <LogIn size={15} />
            <span className="header-sign-in-label">{t("signIn", "Sign In")}</span>
          </button>
        )}
      </div>

      {/* Media query helpers inline for header */}
      <style>{`
        @media (max-width: 767px) {
          .mobile-brand-title { display: flex !important; }
          .desktop-view-title { display: none !important; }
          .mobile-only-profile { display: flex !important; }
          .hide-on-compact { display: none !important; }
        }
      `}</style>
    </header>
  );
}
