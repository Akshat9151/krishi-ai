import React from "react";
import { ShoppingCart, BotMessageSquare, CloudSun, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header({ currentView, setCurrentView }) {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();

  const getTitle = () => {
    switch (currentView) {
      case "dashboard": return "Farm Dashboard";
      case "crop": return "Crop Recommendation";
      case "disease": return "Plant Disease Detection";
      case "assistant": return "Krishi AI Assistant";
      case "weather": return "Weather & Agri-Advisory";
      case "mandi": return "Live Mandi Bhav (Market Rates)";
      case "fertilizer": return "Fertilizer Calculator";
      case "store": return "AgriStore Village Market";
      case "orders": return "My Orders";
      case "tools": return "Farm Advisory Tools";
      case "profile": return "Profile & Settings";
      default: return "Krishi AI";
    }
  };

  return (
    <header
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
            gap: "8px",
            cursor: "pointer",
          }}
          className="mobile-brand-title"
        >
          <span style={{ fontSize: "20px" }}>🌱</span>
          <span style={{ fontWeight: "800", fontSize: "17px", color: "var(--text-primary)" }}>
            Krishi <span style={{ color: "var(--marigold)" }}>AI</span>
          </span>
        </div>

        <div className="desktop-view-title">
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* Right actions: AI shortcut, Weather shortcut, Cart button, Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Quick Weather button */}
        <button
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
          title="View Weather Forecast"
        >
          <CloudSun size={16} color="var(--marigold)" />
          <span className="hide-on-compact">Weather</span>
        </button>

        {/* AI Assistant quick shortcut */}
        <button
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
          title="Chat with Krishi AI"
        >
          <BotMessageSquare size={16} color={currentView === "assistant" ? "#FFFFFF" : "var(--terracotta)"} />
          <span className="hide-on-compact">Ask AI</span>
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
          title="Shopping Cart"
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

        {/* Mobile Profile Icon */}
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
          }}
        >
          {user ? user.username.charAt(0).toUpperCase() : <User size={18} />}
        </button>
      </div>

      {/* Media query helpers inline for header */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-brand-title { display: flex !important; }
          .desktop-view-title { display: none !important; }
          .mobile-only-profile { display: flex !important; }
          .hide-on-compact { display: none !important; }
        }
      `}</style>
    </header>
  );
}
