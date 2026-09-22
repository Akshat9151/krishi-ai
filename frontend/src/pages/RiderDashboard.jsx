import React, { useState, useEffect, useCallback } from "react";
import {
  Bike,
  Navigation,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  IndianRupee,
  RefreshCw,
  LogOut,
  Package,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { riderApi } from "../services/api";

export default function RiderDashboard({ setCurrentView }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "active" | "earnings"
  
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [earnings, setEarnings] = useState({
    today_deliveries: 0,
    today_earnings: 0,
    total_deliveries: 0,
    total_earnings: 0,
    rate_per_delivery: 60,
  });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchAvailable = useCallback(async () => {
    try {
      const res = await riderApi.getAvailable();
      if (Array.isArray(res)) {
        setAvailableOrders(res);
      } else {
        setAvailableOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch available orders:", err);
    }
  }, []);

  const fetchMyDeliveries = useCallback(async () => {
    try {
      const res = await riderApi.getMyDeliveries();
      // Backend returns { active: [...], completed: [...] }
      const allOrders = [
        ...(res?.active ?? []),
        ...(res?.completed ?? []),
      ];
      setMyDeliveries(allOrders.length > 0 ? allOrders : (Array.isArray(res) ? res : []));
    } catch (err) {
      console.error("Failed to fetch rider deliveries:", err);
    }
  }, []);

  const fetchEarnings = useCallback(async () => {
    try {
      const res = await riderApi.getEarnings();
      if (res && !res.detail) {
        setEarnings(res);
      }
    } catch (err) {
      console.error("Failed to fetch rider earnings:", err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchAvailable(), fetchMyDeliveries(), fetchEarnings()]);
    setLoading(false);
  }, [fetchAvailable, fetchMyDeliveries, fetchEarnings]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 8000); // 8-second refresh for real-time ride/delivery requests
    return () => clearInterval(interval);
  }, [refreshAll]);

  // Handle Rapido-style Order Acceptance
  const handleAcceptOrder = async (orderNumber) => {
    setActionLoading(orderNumber);
    try {
      const res = await riderApi.acceptOrder(orderNumber);
      if (res?.error || res?.detail) {
        showToast(`❌ ${res.detail || res.error}`);
      } else {
        showToast(`🎉 Delivery #${orderNumber} Accepted! Navigate to shop.`);
        setActiveTab("active");
        refreshAll();
      }
    } catch (err) {
      showToast(`❌ Acceptance failed: ${err.message || "Network error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Stage Progressions (Picked Up -> Out For Delivery -> Delivered)
  const handleStatusUpdate = async (orderNumber, nextStatus) => {
    setActionLoading(orderNumber);
    try {
      const res = await riderApi.updateStatus(orderNumber, nextStatus);
      if (res?.error || res?.detail) {
        showToast(`❌ ${res.detail || res.error}`);
      } else {
        showToast(`✅ Status updated to: ${nextStatus.replace(/_/g, " ").toUpperCase()}`);
        refreshAll();
      }
    } catch (err) {
      showToast(`❌ Update failed: ${err.message || "Network error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    if (setCurrentView) {
      setCurrentView("login");
    } else {
      window.location.hash = "login";
    }
  };

  // Separate active in-flight orders from completed ones
  const activeOrders = myDeliveries.filter((o) => ["ready_for_pickup", "picked_up", "out_for_delivery"].includes(o.status));
  const completedOrders = myDeliveries.filter((o) => o.status === "delivered");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-cream, #FAF8F5)", paddingBottom: "80px", fontFamily: "var(--font-body, Inter, sans-serif)" }}>
      {/* Rider Header */}
      <header
        style={{
          backgroundColor: "#FFFFFF",
          color: "var(--soil-dark, #24201D)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: "1px solid var(--card-border, #E6DEC8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              backgroundColor: "rgba(196, 92, 53, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--terracotta, #C45C35)",
            }}
          >
            <Bike size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "17px", fontWeight: "700", margin: 0, color: "var(--soil-dark, #24201D)", fontFamily: "var(--font-heading, 'Baloo 2', Poppins, sans-serif)" }}>
                KhetiTak Delivery Partner
              </h1>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  backgroundColor: "var(--growth-green-light, #EAF3E7)",
                  color: "var(--growth-green, #4C7A3A)",
                  border: "1px solid rgba(76, 122, 58, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--growth-green, #4C7A3A)" }} />
                Online
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary, #524B42)", margin: 0 }}>
              {user?.username || "Rider"} • ₹60 / Trip Payout
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => {
              if (setCurrentView) setCurrentView("dashboard");
              else window.location.hash = "dashboard";
            }}
            className="btn btn-secondary"
            style={{
              padding: "8px 12px",
              backgroundColor: "var(--bg-cream, #FAF8F5)",
              border: "1px solid var(--card-border, #E6DEC8)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-primary, #24201D)",
            }}
          >
            🌱 Farmer App
          </button>
          <button
            onClick={() => {
              refreshAll();
              showToast("Synced live requests");
            }}
            className="btn btn-secondary"
            style={{
              padding: "8px 12px",
              backgroundColor: "var(--bg-cream, #FAF8F5)",
              border: "1px solid var(--card-border, #E6DEC8)",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-primary, #24201D)",
            }}
          >
            <RefreshCw size={13} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#FFF5F5",
              color: "#C53030",
              border: "1px solid #FEB2B2",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--soil-dark, #24201D)",
            color: "#FFF",
            padding: "10px 18px",
            borderRadius: "30px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 6px 20px rgba(43, 33, 24, 0.25)",
            zIndex: 9999,
            whiteSpace: "nowrap",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Rider Tab Bar (KhetiTak Brand Bar) */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid var(--card-border, #E6DEC8)",
          position: "sticky",
          top: "68px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setActiveTab("feed")}
          style={{
            flex: 1,
            padding: "14px 8px",
            border: "none",
            borderBottom: activeTab === "feed" ? "3px solid var(--terracotta, #C1440E)" : "3px solid transparent",
            background: "none",
            color: activeTab === "feed" ? "var(--terracotta, #C1440E)" : "var(--text-secondary, #524B42)",
            fontWeight: activeTab === "feed" ? 800 : 600,
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
        >
          Available Orders ({availableOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("active")}
          style={{
            flex: 1,
            padding: "14px 8px",
            border: "none",
            borderBottom: activeTab === "active" ? "3px solid var(--terracotta, #C1440E)" : "3px solid transparent",
            background: "none",
            color: activeTab === "active" ? "var(--terracotta, #C1440E)" : "var(--text-secondary, #524B42)",
            fontWeight: activeTab === "active" ? 800 : 600,
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
        >
          Active Trips ({activeOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("earnings")}
          style={{
            flex: 1,
            padding: "14px 8px",
            border: "none",
            borderBottom: activeTab === "earnings" ? "3px solid var(--terracotta, #C1440E)" : "3px solid transparent",
            background: "none",
            color: activeTab === "earnings" ? "var(--terracotta, #C1440E)" : "var(--text-secondary, #524B42)",
            fontWeight: activeTab === "earnings" ? 800 : 600,
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
        >
          Earnings (₹{earnings.today_earnings || 0})
        </button>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
        {/* ================= TAB 1: AVAILABLE TRIPS FEED (RAPIDO CARD UX) ================= */}
        {activeTab === "feed" && (
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary, #524B42)", marginBottom: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Trips Available for Village Delivery
            </div>

            {availableOrders.length === 0 ? (
              <div
                className="ka-card"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "48px 20px",
                  textAlign: "center",
                  border: "1px dashed var(--card-border, #E6DEC8)",
                }}
              >
                <Bike size={44} style={{ color: "var(--card-border, #E6DEC8)", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", color: "var(--soil-dark, #24201D)", marginBottom: "4px", fontWeight: 700 }}>Searching for local requests...</h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary, #524B42)", margin: 0 }}>
                  As soon as a store marks an order ready for pickup, it will appear here immediately.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {availableOrders.map((order) => (
                  <div
                    key={order.order_number}
                    className="ka-card"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      boxShadow: "0 2px 10px rgba(43, 33, 24, 0.05)",
                      border: "1px solid var(--card-border, #E6DEC8)",
                      padding: "18px",
                      position: "relative",
                    }}
                  >
                    {/* Header Payout Banner */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid var(--card-border, #E6DEC8)",
                        paddingBottom: "12px",
                        marginBottom: "14px",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--text-secondary, #524B42)", fontWeight: 700 }}>ORDER #{order.order_number}</span>
                        <div style={{ fontSize: "14px", color: "var(--soil-dark, #24201D)", fontWeight: 800 }}>
                          {order.items?.length || 1} Item(s) • COD: ₹{(order.total_amount || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: "rgba(196, 92, 53, 0.12)",
                          color: "var(--terracotta, #C1440E)",
                          border: "1px solid rgba(196, 92, 53, 0.25)",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontWeight: "800",
                          fontSize: "13.5px",
                        }}
                      >
                        + ₹60 Payout
                      </div>
                    </div>

                    {/* Rapido style Pickup -> Drop Visual route */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <div
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            backgroundColor: "var(--marigold-light, #FDF4E7)",
                            color: "var(--terracotta, #C1440E)",
                            border: "1px solid var(--marigold)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          P
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary, #524B42)", textTransform: "uppercase", fontWeight: 700 }}>
                            PICKUP STORE
                          </div>
                          <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--soil-dark, #24201D)" }}>
                            KhetiTak Mandi AgriHub
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-secondary, #524B42)" }}>
                            Counter pickup ready
                          </div>
                        </div>
                      </div>

                      <div style={{ marginLeft: "12px", borderLeft: "2px dashed var(--card-border, #E6DEC8)", height: "18px" }} />

                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <div
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(196, 92, 53, 0.12)",
                            color: "var(--terracotta, #C1440E)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          D
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--text-secondary, #524B42)", textTransform: "uppercase", fontWeight: 700 }}>
                            DELIVER TO FARMER
                          </div>
                           <div style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--soil-dark, #24201D)" }}>
                             {order.drop_name || order.customer_name}
                           </div>
                           <div style={{ fontSize: "12px", color: "var(--text-secondary, #524B42)" }}>
                             {order.drop_address || order.address}
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Big Accept CTA Button */}
                    <button
                      disabled={actionLoading === order.order_number}
                      onClick={() => handleAcceptOrder(order.order_number)}
                      style={{
                        width: "100%",
                        padding: "13px",
                        backgroundColor: "var(--terracotta, #C1440E)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(193, 68, 14, 0.25)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {actionLoading === order.order_number ? (
                        "Accepting Delivery..."
                      ) : (
                        <>
                          ACCEPT DELIVERY TRIP <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: ACTIVE TRIPS (RAPIDO IN-FLIGHT UX) ================= */}
        {activeTab === "active" && (
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", marginBottom: "12px", fontWeight: 700, letterSpacing: "0.04em" }}>
              YOUR CURRENT DELIVERIES IN PROGRESS
            </div>

            {activeOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "48px 20px",
                  textAlign: "center",
                  border: "1px dashed var(--card-border, #E6DEC8)",
                }}
              >
                <Package size={44} style={{ color: "var(--card-border, #E6DEC8)", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", color: "var(--soil-dark, #24201D)", marginBottom: "4px", fontWeight: 700 }}>No active trips</h3>
                <p style={{ fontSize: "13px", color: "var(--text-sub, #5C554E)" }}>
                  Switch to the "Available Orders" tab and tap Accept on a delivery request.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {activeOrders.map((order) => {
                  const status = (order.status || "").toLowerCase();
                  const isAssigned = status === "ready_for_pickup";
                  const isPickedUp = status === "picked_up";
                  const isOut = status === "out_for_delivery";

                  return (
                    <div
                      key={order.order_number}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "14px",
                        boxShadow: "0 4px 14px rgba(36, 32, 29, 0.06)",
                        border: "1px solid var(--card-border, #E6DEC8)",
                        padding: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid var(--card-border, #E6DEC8)",
                          paddingBottom: "12px",
                          marginBottom: "14px",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--terracotta, #C1440E)", letterSpacing: "0.05em" }}>ACTIVE MISSION</span>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--soil-dark, #24201D)" }}>
                            #{order.order_number}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              backgroundColor: "rgba(232, 163, 61, 0.15)",
                              color: "var(--terracotta, #C1440E)",
                              border: "1px solid rgba(232, 163, 61, 0.3)",
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            {status.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--terracotta, #C1440E)", marginTop: "2px" }}>
                            Payout: ₹60
                          </div>
                        </div>
                      </div>

                      {/* Customer Contact Card */}
                      <div
                        style={{
                          backgroundColor: "var(--bg-cream, #FAF8F5)",
                          border: "1px solid var(--card-border, #E6DEC8)",
                          borderRadius: "10px",
                          padding: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ fontSize: "11px", color: "var(--text-sub, #5C554E)", textTransform: "uppercase", fontWeight: 700 }}>
                          FARMER RECIPIENT
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--soil-dark, #24201D)", marginTop: "2px" }}>
                          {order.customer_name || order.drop_name}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-sub, #5C554E)", marginTop: "2px" }}>
                          {order.address || order.drop_address}
                        </div>

                        {(order.phone || order.drop_phone) && (
                          <a
                            href={`tel:${order.phone || order.drop_phone}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              backgroundColor: "var(--soil-dark, #24201D)",
                              color: "#FFFFFF",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              fontSize: "13px",
                              fontWeight: 700,
                              marginTop: "10px",
                            }}
                          >
                            <Phone size={14} /> Call Farmer ({order.phone || order.drop_phone})
                          </a>
                        )}
                      </div>

                      {/* Progressive 3-Stage Rapido Execution Buttons */}
                      {isAssigned && (
                        <div>
                          <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", marginBottom: "8px", fontWeight: 600 }}>
                            Step 1: Arrive at Store Counter and pick up the package
                          </div>
                          <button
                            disabled={actionLoading === order.order_number}
                            onClick={() => handleStatusUpdate(order.order_number, "picked_up")}
                            style={{
                              width: "100%",
                              padding: "14px",
                              backgroundColor: "var(--marigold, #E8A33D)",
                              color: "var(--soil-dark, #24201D)",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: 800,
                              fontSize: "14px",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(232, 163, 61, 0.3)",
                            }}
                          >
                            📦 CONFIRM PACKAGE PICKED UP FROM SHOP
                          </button>
                        </div>
                      )}

                      {isPickedUp && (
                        <div>
                          <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", marginBottom: "8px", fontWeight: 600 }}>
                            Step 2: Start riding toward the farm delivery location
                          </div>
                          <button
                            disabled={actionLoading === order.order_number}
                            onClick={() => handleStatusUpdate(order.order_number, "out_for_delivery")}
                            style={{
                              width: "100%",
                              padding: "14px",
                              backgroundColor: "var(--terracotta, #C1440E)",
                              color: "#FFF",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: 800,
                              fontSize: "14px",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(193, 68, 14, 0.25)",
                            }}
                          >
                            🛵 START RIDE (OUT FOR DELIVERY)
                          </button>
                        </div>
                      )}

                      {isOut && (
                        <div>
                          <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", marginBottom: "8px", fontWeight: 600 }}>
                            Step 3: Hand over package to farmer & collect payment
                          </div>
                          <div
                            style={{
                              backgroundColor: "#FEF9EE",
                              border: "1px solid #E8A33D",
                              padding: "10px",
                              borderRadius: "8px",
                              marginBottom: "10px",
                              fontSize: "13px",
                              color: "#8C5E00",
                              fontWeight: 700,
                            }}
                          >
                            💰 Collect COD: ₹{(order.total_amount || 0).toLocaleString("en-IN")} from farmer
                          </div>
                          <button
                            disabled={actionLoading === order.order_number}
                            onClick={() => handleStatusUpdate(order.order_number, "delivered")}
                            style={{
                              width: "100%",
                              padding: "14px",
                              backgroundColor: "var(--growth-green, #4C7A3A)",
                              color: "#FFF",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: 800,
                              fontSize: "14px",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(76, 122, 58, 0.3)",
                            }}
                          >
                            ✅ CONFIRM DELIVERED & COLLECTED
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: EARNINGS & COMPLETED TRIPS ================= */}
        {activeTab === "earnings" && (
          <div>
            {/* Earnings Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "1px solid var(--card-border, #E6DEC8)",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", fontWeight: 700 }}>TODAY'S EARNINGS</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--terracotta, #C1440E)", margin: "4px 0" }}>
                  ₹{(earnings.today_earnings || 0).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)" }}>{earnings.today_deliveries || 0} drops completed</div>
              </div>

              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "1px solid var(--card-border, #E6DEC8)",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", fontWeight: 700 }}>LIFETIME PAYOUT</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--soil-dark, #24201D)", margin: "4px 0" }}>
                  ₹{(earnings.total_earnings || 0).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)" }}>{earnings.total_deliveries || 0} total trips</div>
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", marginBottom: "12px", fontWeight: 700, letterSpacing: "0.04em" }}>
              COMPLETED TRIPS HISTORY
            </div>

            {completedOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "36px 16px",
                  textAlign: "center",
                  border: "1px dashed var(--card-border, #E6DEC8)",
                }}
              >
                <Clock size={36} style={{ color: "var(--card-border, #E6DEC8)", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "13px", color: "var(--text-sub, #5C554E)" }}>Completed trips will appear here for payout record.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {completedOrders.map((order) => (
                  <div
                    key={order.order_number}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid var(--card-border, #E6DEC8)",
                      padding: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)",
                    }}
                  >
                    <div>
                       <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--soil-dark, #24201D)" }}>
                         #{order.order_number} • {order.customer_name || order.drop_name}
                       </div>
                       <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)" }}>
                         {order.address || order.drop_address || "Delivered"} • {order.delivered_at ? new Date(order.delivered_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Delivered"}
                       </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--growth-green, #4C7A3A)" }}>+ ₹60</div>
                      <span style={{ fontSize: "11px", color: "var(--growth-green, #4C7A3A)", backgroundColor: "rgba(76, 122, 58, 0.1)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>Settled</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
