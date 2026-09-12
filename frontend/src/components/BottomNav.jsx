import React from "react";
import {
  Home,
  Wrench,
  ShoppingBag,
  User,
  BotMessageSquare,
} from "lucide-react";

export default function BottomNav({ currentView, setCurrentView }) {
  // Determine active tab
  const isHome = currentView === "dashboard";
  const isTools = ["tools", "crop", "disease", "weather", "mandi", "fertilizer"].includes(currentView);
  const isStore = ["store", "orders"].includes(currentView);
  const isProfile = currentView === "profile";
  const isAssistant = currentView === "assistant";

  const tabs = [
    {
      id: "dashboard",
      label: "Home",
      hindi: "होम",
      icon: Home,
      isActive: isHome,
    },
    {
      id: "tools",
      label: "Tools",
      hindi: "उपकरण",
      icon: Wrench,
      isActive: isTools,
    },
    {
      id: "store",
      label: "Store",
      hindi: "दुकान",
      icon: ShoppingBag,
      isActive: isStore,
    },
    {
      id: "profile",
      label: "Profile",
      hindi: "प्रोफ़ाइल",
      icon: User,
      isActive: isProfile,
    },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              padding: "8px 4px",
              background: "transparent",
              border: "none",
              color: tab.isActive ? "var(--terracotta)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "26px",
                borderRadius: "14px",
                backgroundColor: tab.isActive ? "var(--terracotta-light)" : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={20} color={tab.isActive ? "var(--terracotta)" : "var(--text-secondary)"} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: tab.isActive ? "700" : "500" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
