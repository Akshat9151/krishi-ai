import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Search, Filter, Calendar, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { mandiApi } from "../services/api";

export default function MandiBhav() {
  const [commodity, setCommodity] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const commodities = [
    { value: "all", label: "All Commodities (सभी फसलें)" },
    { value: "wheat", label: "Wheat (गेहूं)" },
    { value: "mustard", label: "Mustard (सरसों)" },
    { value: "soybean", label: "Soybean (सोयाबीन)" },
    { value: "cotton", label: "Cotton (कपास)" },
    { value: "rice", label: "Rice / Paddy (धान)" },
    { value: "onion", label: "Onion (प्याज)" },
    { value: "potato", label: "Potato (आलू)" },
    { value: "gram", label: "Gram / Chana (चना)" },
    { value: "maize", label: "Maize (मक्का)" },
  ];

  const states = [
    "All States",
    "Punjab",
    "Haryana",
    "Rajasthan",
    "Madhya Pradesh",
    "Maharashtra",
    "Gujarat",
    "Uttar Pradesh",
    "Bihar",
  ];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await mandiApi.getPrices({
        commodity: commodity === "all" ? "" : commodity,
        state: stateFilter === "All States" ? "" : stateFilter,
        search,
      });
      setPrices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [commodity, stateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPrices();
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title & Live Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
              Mandi Bhav / Market Price Tracker (दैनिक मंडी भाव)
            </h2>
            <span className="badge-green">● LIVE APMC RATES</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Real-time daily modal commodity prices reported across Indian regulated agricultural mandis.
          </p>
        </div>

        <button
          className="btn-outline"
          onClick={fetchPrices}
          style={{ fontSize: "13px", padding: "7px 14px" }}
        >
          <RefreshCw size={14} />
          <span>Refresh Rates</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="ka-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {/* Commodity Dropdown */}
          <div>
            <label className="input-label">Filter by Crop / Commodity</label>
            <select
              className="input-field"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
            >
              {commodities.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div>
            <label className="input-label">Filter by State (राज्य)</label>
            <select
              className="input-field"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="input-label">Search Mandi or District</label>
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Neemuch, Khanna, Lasalgaon"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: "0 14px" }}>
                <Search size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Price Table / Cards */}
      {loading ? (
        <div className="ka-card" style={{ textAlign: "center", padding: "50px" }}>
          <span style={{ fontSize: "36px" }}>📊</span>
          <h4 style={{ fontSize: "16px", marginTop: "12px" }}>Loading latest APMC arrivals and bid quotes...</h4>
          <div className="growing-bar" style={{ maxWidth: "200px", margin: "14px auto 0 auto" }}></div>
        </div>
      ) : prices.length === 0 ? (
        <div className="ka-card" style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            No mandi quotes found matching the selected filters.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
            {prices.map((mandi) => {
              const isUp = mandi.trend === "up";
              return (
                <div
                  key={mandi.id}
                  className="ka-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h4 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)" }}>
                          {mandi.commodity}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)", fontSize: "12.5px", marginTop: "2px" }}>
                          <MapPin size={14} color="var(--terracotta)" />
                          <span>{mandi.market}, {mandi.district} ({mandi.state})</span>
                        </div>
                      </div>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "12px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor: isUp ? "var(--growth-green-light)" : "var(--terracotta-light)",
                          color: isUp ? "var(--growth-green)" : "var(--terracotta)",
                        }}
                      >
                        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        <span>{mandi.change}</span>
                      </span>
                    </div>

                    {/* Modal Price Highlight */}
                    <div
                      style={{
                        margin: "14px 0",
                        padding: "12px",
                        backgroundColor: "var(--bg-cream)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--card-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "11.5px", fontWeight: "700", color: "var(--text-secondary)" }}>
                          MODAL RATE (औसत भाव)
                        </span>
                        <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--terracotta)", margin: 0 }}>
                          ₹{mandi.modalPrice.toLocaleString("en-IN")}{" "}
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>/ Quintal</span>
                        </p>
                      </div>

                      <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-secondary)" }}>
                        <div>Min: ₹{mandi.minPrice}</div>
                        <div>Max: ₹{mandi.maxPrice}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "var(--text-muted)", borderTop: "1px solid var(--card-border)", paddingTop: "8px" }}>
                    <span>Arrival: {mandi.arrivalDate}</span>
                    <span>Agmarknet Verified</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "var(--marigold-light)",
              borderRadius: "var(--radius-sm)",
              fontSize: "12.5px",
              color: "#A36B18",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} />
            <span>
              Rates reflect regulated APMC benchmark daily quotes (1 Quintal = 100 kg). Transport, loading, and moisture allowances may vary by local trader.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
