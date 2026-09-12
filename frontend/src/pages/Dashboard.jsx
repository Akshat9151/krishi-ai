import React, { useState, useEffect } from "react";
import {
  Sprout,
  ScanSearch,
  BotMessageSquare,
  CloudSun,
  TrendingUp,
  Calculator,
  ShoppingBag,
  ArrowRight,
  Clock,
  Sparkles,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { coreApi } from "../services/api";

export default function Dashboard({ setCurrentView }) {
  const { user, preferences } = useAuth();
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const city = preferences?.farmLocation?.split(",")[0]?.trim() || "Jaipur";
        const wData = await coreApi.getWeather(city);
        setWeather(wData);
      } catch (err) {
        console.warn("Weather fetch error on dashboard:", err);
      } finally {
        setLoadingWeather(false);
      }

      try {
        const acts = await coreApi.getActivities();
        setActivities(acts);
      } catch (err) {
        console.warn("Activities fetch error:", err);
      }
    };

    fetchDashboardData();
  }, [preferences?.farmLocation]);

  const quickActions = [
    {
      id: "crop",
      title: t("cropRecTitle", "Crop Recommendation"),
      desc: t("cropRecSubtitle", "Find optimal crops based on soil, season & local weather"),
      icon: Sprout,
      color: "var(--growth-green)",
      bg: "var(--growth-green-light)",
    },
    {
      id: "disease",
      title: t("diseaseTitle", "Disease Detection"),
      desc: t("diseaseSubtitle", "Diagnose crop symptoms and get instant remedy recommendations"),
      icon: ScanSearch,
      color: "var(--terracotta)",
      bg: "var(--terracotta-light)",
    },
    {
      id: "mandi",
      title: t("mandiTitle", "Live Mandi Bhav"),
      desc: "Check today's commodity market prices across Indian APMCs",
      icon: TrendingUp,
      color: "var(--marigold-hover)",
      bg: "var(--marigold-light)",
    },
    {
      id: "fertilizer",
      title: t("fertilizerTitle", "Fertilizer Calculator"),
      desc: "Calculate exact Urea, DAP & Potash doses for your farm land",
      icon: Calculator,
      color: "var(--growth-green)",
      bg: "var(--growth-green-light)",
    },
    {
      id: "store",
      title: t("agriStore", "AgriStore Village Market"),
      desc: t("storeSubheader", "Buy certified seeds, fertilizers & tools with home delivery"),
      icon: ShoppingBag,
      color: "var(--terracotta)",
      bg: "var(--terracotta-light)",
    },
    {
      id: "assistant",
      title: t("assistantTitle", "Ask Krishi AI"),
      desc: t("assistantSubtitle", "Chat with your 24/7 AI farming advisor in Hindi & English"),
      icon: BotMessageSquare,
      color: "var(--marigold)",
      bg: "var(--marigold-light)",
    },
  ];

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Welcome Banner */}
      <div
        className="ka-card"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, var(--marigold-light) 100%)",
          borderColor: "var(--marigold)",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "22px" }}>🌾</span>
            <span className="badge-marigold">{t("welcomeFarmer", "Namaste, Farmer")}</span>
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>
            {t("welcome", "Welcome back")}, {user ? user.username : t("farmer", "Kisan Bhai")}!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "600px" }}>
            {t("welcomeDesc", "Real-time advisory, market mandis, and smart crop planning for your farm")} in{" "}
            <strong>{preferences?.farmLocation || "Jaipur, Rajasthan"}</strong>.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setCurrentView("assistant")}
          style={{ padding: "12px 20px" }}
        >
          <Sparkles size={16} />
          <span>{t("featAssistant", "Ask Krishi AI")}</span>
        </button>
      </div>

      {/* Weather Glance & Seasonal Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {/* Weather Card */}
        <div className="ka-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>
                Live Weather • {weather?.location || "Jaipur"}
              </span>
              <span className="badge-green">Live Advisory</span>
            </div>
            {loadingWeather ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Updating weather data...</p>
            ) : weather ? (
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)" }}>
                    {weather.temperature}°C
                  </span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "13.5px" }}>
                    Humidity: {weather.humidity}%
                  </span>
                </div>
                <div style={{ display: "flex", gap: "14px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Droplets size={15} color="var(--growth-green)" />
                    <span>{weather.rainfall} mm Rain</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Wind size={15} color="var(--marigold)" />
                    <span>{weather.wind_speed} km/h Wind</span>
                  </div>
                </div>
                {weather.recommendations && (
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "var(--text-secondary)",
                      marginTop: "12px",
                      padding: "8px 10px",
                      backgroundColor: "var(--bg-cream)",
                      borderRadius: "6px",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    💡 {weather.recommendations.split("\n")[0]}
                  </p>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Weather currently unavailable.</p>
            )}
          </div>
          <button
            onClick={() => setCurrentView("weather")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--terracotta)",
              fontWeight: "600",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              paddingTop: "14px",
            }}
          >
            <span>{t("weatherTitle", "Detailed Forecast")}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Season & Land Summary */}
        <div className="ka-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>
              {t("profileTitle", "Farm Profile Status")}
            </span>
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>Current Agro Season:</span>
                <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{t("seasonRabi", "Rabi Season (रबी)")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>Primary Crop:</span>
                <span style={{ fontWeight: "700", color: "var(--growth-green)" }}>{preferences.primaryCrop}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>Registered Land Size:</span>
                <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                  {preferences.landSize} {preferences.landUnit}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentView("fertilizer")}
            className="btn-secondary"
            style={{ marginTop: "14px", width: "100%", fontSize: "13px" }}
          >
            <Calculator size={15} />
            <span>{t("fertilizerTitle", "Calculate Fertilizer Dose")}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div>
        <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "14px" }}>
          {t("quickActions", "Farm Advisory & Tools")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="ka-card ka-card-interactive"
                onClick={() => setCurrentView(action.id)}
                style={{ cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: action.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Icon size={22} color={action.color} />
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px" }}>
                    {action.title}
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {action.desc}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "var(--terracotta)",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    marginTop: "14px",
                  }}
                >
                  <span>Open Tool</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Farming Activity */}
      <div className="ka-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Clock size={18} color="var(--terracotta)" />
          <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
            {t("statDaysActive", "Recent Activities")}
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {activities.length > 0 ? (
            activities.map((act, index) => (
              <div
                key={act.id || index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-cream)",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>🌾</span>
                  <span style={{ fontSize: "13.5px", color: "var(--text-primary)" }}>{act.text}</span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{act.time}</span>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No recent activities recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
