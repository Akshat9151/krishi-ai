import React, { useEffect, useState } from "react";
import { User, MapPin, Globe, Bell, Volume2, BotMessageSquare, LogOut, Save, Check, Store, Bike, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { storeApi, shopApi } from "../services/api";

export default function Profile({ setCurrentView }) {
  const { user, preferences, updatePreferences, logout } = useAuth();
  const { language: appLang, setLanguage: setAppLang, languages, t } = useTranslation();

  const [farmLocation, setFarmLocation] = useState(preferences?.farmLocation || "Jaipur, Rajasthan");
  const [landSize, setLandSize] = useState(preferences?.landSize || "3");
  const [landUnit, setLandUnit] = useState(preferences?.landUnit || "Acres");
  const [primaryCrop, setPrimaryCrop] = useState(preferences?.primaryCrop || "Wheat");
  const [language, setLanguage] = useState(appLang || preferences?.language || "hi");
  const [soundEnabled, setSoundEnabled] = useState(preferences?.soundEnabled ?? true);
  const [saved, setSaved] = useState(false);
  const [shopOrders, setShopOrders] = useState(null);

  useEffect(() => {
    if (!user) return;
    shopApi.getOrders("all")
      .then((res) => {
        if (Array.isArray(res)) setShopOrders(res);
        else if (res?.orders) setShopOrders(res.orders);
        else setShopOrders([]);
      })
      .catch(() => setShopOrders([]));
  }, [user]);

  const updateShopStatus = async (orderNumber, action) => {
    try {
      await shopApi.updateOrderAction(orderNumber, action);
      const res = await shopApi.getOrders("all");
      if (Array.isArray(res)) setShopOrders(res);
      else if (res?.orders) setShopOrders(res.orders);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePreferences({
      farmLocation,
      landSize,
      landUnit,
      primaryCrop,
      language,
      soundEnabled,
    });
    setAppLang(language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-container" style={{ maxWidth: "780px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)" }}>
          Farmer Profile & Farm Settings (प्रोफ़ाइल व सेटिंग्स)
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Manage your account credentials, regional farm preferences, and AI assistant settings.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div
        className="ka-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          background: "linear-gradient(135deg, #FFFFFF 0%, var(--marigold-light) 100%)",
          borderColor: "var(--marigold)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "var(--terracotta)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "800",
              boxShadow: "0 4px 10px rgba(193, 68, 14, 0.25)",
            }}
          >
            {user ? user.username.charAt(0).toUpperCase() : "K"}
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
              {user ? user.username : "Guest Farmer"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
              Verified KhetiTak Account • {preferences?.farmLocation || "Jaipur, Rajasthan"}
            </p>
          </div>
        </div>

        {/* AI Assistant shortcut */}
        <button
          className="btn-secondary"
          onClick={() => setCurrentView("assistant")}
          style={{ padding: "10px 16px" }}
        >
          <BotMessageSquare size={17} color="var(--terracotta)" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Partner Portals Quick Access */}
      <div className="ka-card" style={{ borderLeft: "4px solid var(--terracotta)", background: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
              Partner Operations & Fulfilment Hubs
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
              Switch directly to store order fulfillment or delivery rider operations.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          <button
            type="button"
            onClick={() => setCurrentView("shop-dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid var(--card-border)",
              backgroundColor: "var(--bg-cream)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--terracotta)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "rgba(196, 92, 53, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--terracotta)" }}>
                <Store size={20} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                  Shop & Agency Hub
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  Incoming orders, prep queue, stock
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--terracotta)" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentView("rider-dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid var(--card-border)",
              backgroundColor: "var(--bg-cream)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--growth-green)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "var(--growth-green-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--growth-green)" }}>
                <Bike size={20} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                  Delivery Rider App
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  Trip feed, pickups & ₹60 earnings
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--growth-green)" />
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="ka-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Farm & Field Parameters</h3>

        {/* Location & Primary Crop */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <div>
            <label htmlFor="profile-farm-location" className="input-label">Default Farm Location / District</label>
            <input
              id="profile-farm-location"
              type="text"
              className="input-field"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              placeholder="e.g. Jaipur, Rajasthan"
            />
          </div>

          <div>
            <label htmlFor="profile-primary-crop" className="input-label">Primary Standing Crop</label>
            <select
              id="profile-primary-crop"
              aria-label="Primary Standing Crop"
              className="input-field"
              value={primaryCrop}
              onChange={(e) => setPrimaryCrop(e.target.value)}
            >
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Rice">Rice / Paddy (धान)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Maize">Maize (मक्का)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Sugarcane">Sugarcane (गन्ना)</option>
            </select>
          </div>
        </div>

        {/* Land Size */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <div>
            <label htmlFor="profile-land-size" className="input-label">Total Cultivated Area</label>
            <input
              id="profile-land-size"
              type="number"
              step="0.5"
              className="input-field"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="profile-land-unit" className="input-label">Measurement Unit</label>
            <select
              id="profile-land-unit"
              aria-label="Measurement Unit"
              className="input-field"
              value={landUnit}
              onChange={(e) => setLandUnit(e.target.value)}
            >
              <option value="Acres">Acres (एकड़)</option>
              <option value="Bigha">Bigha (बीघा)</option>
              <option value="Hectares">Hectares (हेक्टेयर)</option>
            </select>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--card-border)", margin: "4px 0" }} />

        {/* Language & Sound Preferences */}
        <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Application Preferences</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <div>
            <label htmlFor="profile-language-select" className="input-label">Preferred Advisory Language (भाषा)</label>
            <select
              id="profile-language-select"
              aria-label="Preferred Advisory Language"
              className="input-field"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.native})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Voice Audio Advisory</label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 14px",
                backgroundColor: "var(--bg-cream)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--card-border)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                style={{ accentColor: "var(--terracotta)", width: "18px", height: "18px" }}
              />
              <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>
                Read answers out loud (आवाज में सुनें)
              </span>
            </label>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
          <button type="submit" className="btn-primary" style={{ padding: "11px 24px" }}>
            {saved ? (
              <>
                <Check size={16} />
                <span>Saved Preferences!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Farm Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {shopOrders && (
        <div className="ka-card">
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginTop: 0 }}>Shop Orders</h3>
          {shopOrders.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No incoming orders yet.</p>
          ) : shopOrders.map((order) => (
            <div key={order.order_number} style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", borderTop: "1px solid var(--card-border)", padding: "12px 0", flexWrap: "wrap" }}>
              <div>
                <strong>{order.order_number}</strong>
                <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{order.customer_name} · ₹{order.total_amount}</div>
              </div>
              <select className="input-field" value={order.status} onChange={(event) => updateShopStatus(order.order_number, event.target.value)} style={{ width: "190px" }}>
                {["confirmed", "accepted", "packed", "out_for_delivery", "delivered", "cancelled"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Account Security & Sign Out */}
      <div className="ka-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            Account Session
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
            Currently logged in as <strong>{user ? user.username : "Guest"}</strong>.
          </p>
        </div>

        {user ? (
          <button
            onClick={() => {
              logout();
              setCurrentView("login");
            }}
            className="btn-outline"
            style={{ color: "var(--terracotta)", borderColor: "var(--terracotta)", fontSize: "13px" }}
          >
            <LogOut size={15} />
            <span>{t("signOut", "Sign Out from Device")}</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentView("login")}
            className="btn-primary"
            style={{ fontSize: "13px" }}
          >
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </div>
  );
}
