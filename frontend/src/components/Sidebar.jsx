import React from "react";
import {
  LayoutDashboard,
  Sprout,
  ScanSearch,
  BotMessageSquare,
  CloudSun,
  TrendingUp,
  Calculator,
  Store,
  PackageCheck,
  UserCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", hindi: "डैशबोर्ड", icon: LayoutDashboard },
    { id: "crop", label: "Crop Recommendation", hindi: "फसल सलाह", icon: Sprout },
    { id: "disease", label: "Disease Detection", hindi: "रोग पहचान", icon: ScanSearch },
    { id: "assistant", label: "AI Assistant", hindi: "कृषि मित्र (AI)", icon: BotMessageSquare },
    { id: "weather", label: "Weather Insights", hindi: "मौसम जानकारी", icon: CloudSun },
    { id: "mandi", label: "Mandi Bhav", hindi: "मंडी भाव", icon: TrendingUp, badge: "Live" },
    { id: "fertilizer", label: "Fertilizer Calculator", hindi: "खाद कैलकुलेटर", icon: Calculator, badge: "New" },
    { id: "store", label: "AgriStore", hindi: "कृषि बाज़ार", icon: Store },
    { id: "orders", label: "My Orders", hindi: "मेरे ऑर्डर", icon: PackageCheck },
  ];

  return (
    <aside className="desktop-sidebar">
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "4px 8px 20px 8px", borderBottom: "1px solid var(--card-border)" }}>
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, var(--growth-green), var(--marigold))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontSize: "22px",
          boxShadow: "0 2px 6px rgba(76, 122, 58, 0.25)"
        }}>
          🌱
        </div>
        <div>
          <h2 style={{ fontSize: "19px", fontWeight: "800", color: "var(--text-primary)", lineHeight: "1.2" }}>
            Krishi <span style={{ color: "var(--marigold)" }}>AI</span>
          </h2>
          <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", fontWeight: "500" }}>
            Smart Farm Companion
          </p>
        </div>
      </div>

      {/* Navigation List — All 9 Flat items */}
      <nav style={{ flex: 1, overflowY: "auto", margin: "14px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: isActive ? "var(--marigold-light)" : "transparent",
                color: isActive ? "var(--terracotta)" : "var(--text-primary)",
                fontWeight: isActive ? "700" : "500",
                fontSize: "13.5px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
                borderLeft: isActive ? "3px solid var(--terracotta)" : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-cream)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon size={18} color={isActive ? "var(--terracotta)" : "var(--text-secondary)"} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: "700",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    background: item.badge === "Live" ? "var(--growth-green-light)" : "var(--terracotta-light)",
                    color: item.badge === "Live" ? "var(--growth-green)" : "var(--terracotta)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Profile & Logout Footer */}
      <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={() => setCurrentView("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--card-border)",
            background: currentView === "profile" ? "var(--marigold-light)" : "#FFFFFF",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--marigold-light)",
              border: "1.5px solid var(--marigold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--terracotta)"
            }}>
              {user ? user.username.charAt(0).toUpperCase() : "K"}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.2" }}>
                {user ? user.username : "Guest Farmer"}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                Profile & Settings
              </p>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </button>

        {user && (
          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "transparent",
              color: "var(--terracotta)",
              fontSize: "12.5px",
              fontWeight: "600",
              cursor: "pointer",
              justifyContent: "center",
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
