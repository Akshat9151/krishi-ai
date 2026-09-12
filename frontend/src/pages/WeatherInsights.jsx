import React, { useState, useEffect } from "react";
import { CloudSun, Droplets, Wind, Thermometer, Compass, AlertCircle, Search, MapPin } from "lucide-react";
import { coreApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function WeatherInsights() {
  const { preferences } = useAuth();
  const [city, setCity] = useState(preferences?.farmLocation?.split(",")[0]?.trim() || "Jaipur");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quickCities = ["Jaipur", "Ludhiana", "Bhopal", "Indore", "Ahmedabad", "Lucknow", "Nagpur", "Patna"];

  const fetchWeather = async (targetCity) => {
    const loc = targetCity || city;
    if (!loc.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await coreApi.getWeather(loc);
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch weather data for this location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)" }}>
          Agri-Weather Forecast & Advisory (कृषि मौसम सलाह)
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Live meteorological alerts and tailored irrigation/spraying guidance for Indian crop cycles.
        </p>
      </div>

      {/* Search and Quick Filters */}
      <div className="ka-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <MapPin size={18} color="var(--terracotta)" style={{ position: "absolute", top: "12px", left: "12px" }} />
            <input
              type="text"
              className="input-field"
              placeholder="Enter district or city name (e.g. Jaipur, Ludhiana)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ paddingLeft: "38px" }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search size={16} />
            <span>Check Weather</span>
          </button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600", marginRight: "4px" }}>
            Popular Districts:
          </span>
          {quickCities.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${city.toLowerCase() === c.toLowerCase() ? "active" : ""}`}
              onClick={() => {
                setCity(c);
                fetchWeather(c);
              }}
              style={{ fontSize: "11.5px", padding: "3px 10px" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "var(--terracotta-light)", color: "var(--terracotta)", borderRadius: "var(--radius-sm)", fontSize: "13.5px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="ka-card" style={{ textAlign: "center", padding: "50px" }}>
          <span style={{ fontSize: "36px" }}>🌦️</span>
          <h4 style={{ fontSize: "16px", marginTop: "12px" }}>Fetching live atmospheric readings...</h4>
          <div className="growing-bar" style={{ maxWidth: "200px", margin: "14px auto 0 auto" }}></div>
        </div>
      ) : weather ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Main Weather Hero Card */}
          <div
            className="ka-card"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, var(--marigold-light) 100%)",
              borderColor: "var(--marigold)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span className="badge-marigold">CURRENT CONDITIONS</span>
                <h3 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", marginTop: "4px" }}>
                  {weather.location}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", margin: 0 }}>
                  Updated real-time for field agricultural planning
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "48px", fontWeight: "800", color: "var(--text-primary)" }}>
                  {weather.temperature}°C
                </span>
              </div>
            </div>

            {/* 4 Metric Tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "20px" }}>
              <div style={{ padding: "14px", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                  <Thermometer size={16} color="var(--terracotta)" />
                  <span>Temperature</span>
                </div>
                <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px", margin: 0 }}>
                  {weather.temperature}°C
                </p>
              </div>

              <div style={{ padding: "14px", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                  <Droplets size={16} color="var(--growth-green)" />
                  <span>Humidity</span>
                </div>
                <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px", margin: 0 }}>
                  {weather.humidity}%
                </p>
              </div>

              <div style={{ padding: "14px", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                  <CloudSun size={16} color="var(--marigold)" />
                  <span>Rainfall</span>
                </div>
                <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px", margin: 0 }}>
                  {weather.rainfall} mm
                </p>
              </div>

              <div style={{ padding: "14px", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                  <Wind size={16} color="var(--terracotta)" />
                  <span>Wind Speed</span>
                </div>
                <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginTop: "4px", margin: 0 }}>
                  {weather.wind_speed} km/h
                </p>
              </div>
            </div>
          </div>

          {/* Farming Advisory Box */}
          {weather.recommendations && (
            <div className="ka-card" style={{ borderLeft: "5px solid var(--growth-green)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <AlertCircle size={20} color="var(--growth-green)" />
                <h4 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
                  Official Agricultural Field Advisory (कृषि परामर्श)
                </h4>
              </div>
              <div style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: "1.6", whiteSpace: "pre-line", padding: "10px 14px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)" }}>
                {weather.recommendations}
              </div>
            </div>
          )}

          {/* Field Operational Rules */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div className="ka-card">
              <h5 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "6px", color: "var(--terracotta)" }}>
                💧 Irrigation Guidance
              </h5>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {weather.rainfall > 10
                  ? "Significant rainfall predicted. Postpone field irrigation and inspect drainage to avoid waterlogging."
                  : "Dry weather observed. Light morning or evening furrow irrigation is advised for standing winter/monsoon crops."}
              </p>
            </div>

            <div className="ka-card">
              <h5 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "6px", color: "var(--marigold-hover)" }}>
                💨 Spraying Safety Window
              </h5>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {weather.wind_speed > 15
                  ? "High wind speeds detected (>15 km/h). Avoid pesticide or herbicide spraying today to prevent chemical drift."
                  : "Calm wind speeds. Safe window for foliar fertilizer and pesticide application during early morning."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
