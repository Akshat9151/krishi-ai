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
    <div style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", paddingBottom: "80px" }}>
      {/* Rider Header */}
      <header
        style={{
          backgroundColor: "#1A202C",
          color: "#FFFFFF",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#38A169",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
            }}
          >
            <Bike size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <h1 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#FFF" }}>
                KhetiTak Captain
              </h1>
              <span style={{ fontSize: "10px", backgroundColor: "#276749", padding: "2px 6px", borderRadius: "10px" }}>
                ONLINE
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#A0AEC0", margin: 0 }}>
              {user?.username || "Rider Partner"} • Earn ₹60 / Drop
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => {
              refreshAll();
              showToast("Synced live requests");
            }}
            style={{
              background: "#2D3748",
              border: "none",
              color: "#FFF",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
            }}
          >
            <RefreshCw size={13} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "#742A2A",
              border: "none",
              color: "#FFF",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
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
            backgroundColor: "#2D3748",
            color: "#FFF",
            padding: "10px 18px",
            borderRadius: "30px",
            fontSize: "13px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            zIndex: 9999,
            whiteSpace: "nowrap",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Rider Tab Bar (Rapido Mobile-Friendly Bar) */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
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
            borderBottom: activeTab === "feed" ? "3px solid #38A169" : "3px solid transparent",
            background: "none",
            color: activeTab === "feed" ? "#22543D" : "#718096",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "center",
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
            borderBottom: activeTab === "active" ? "3px solid #38A169" : "3px solid transparent",
            background: "none",
            color: activeTab === "active" ? "#22543D" : "#718096",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "center",
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
            borderBottom: activeTab === "earnings" ? "3px solid #38A169" : "3px solid transparent",
            background: "none",
            color: activeTab === "earnings" ? "#22543D" : "#718096",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "center",
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
            <div style={{ fontSize: "12px", color: "#718096", marginBottom: "12px", fontWeight: 600 }}>
              TRIPS NEARBY READY FOR PICKUP
            </div>

            {availableOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "48px 20px",
                  textAlign: "center",
                  border: "1px dashed #CBD5E0",
                }}
              >
                <Bike size={44} style={{ color: "#CBD5E0", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", color: "#2D3748", marginBottom: "4px" }}>Searching for requests...</h3>
                <p style={{ fontSize: "13px", color: "#718096" }}>
                  As soon as a store packs an order and marks it ready, it will ping here.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {availableOrders.map((order) => (
                  <div
                    key={order.order_number}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "14px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      border: "2px solid #38A169",
                      padding: "16px",
                      position: "relative",
                    }}
                  >
                    {/* Header Payout Banner */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #EDF2F7",
                        paddingBottom: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>ORDER #{order.order_number}</span>
                        <div style={{ fontSize: "13px", color: "#2D3748", fontWeight: 700 }}>
                          {order.items?.length || 1} Item(s) • COD: ₹{(order.total_amount || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#C6F6D5",
                          color: "#22543D",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontWeight: "800",
                          fontSize: "14px",
                        }}
                      >
                        + ₹60 Payout
                      </div>
                    </div>

                    {/* Rapido style Pickup -> Drop Visual route */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#FEFCBF",
                            color: "#975A16",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          P
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "#718096", textTransform: "uppercase", fontWeight: 700 }}>
                            PICKUP LOCATION
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#2D3748" }}>
                            KhetiTak Central Agro Hub
                          </div>
                          <div style={{ fontSize: "12px", color: "#718096" }}>
                            Ready on merchant counter
                          </div>
                        </div>
                      </div>

                      <div style={{ marginLeft: "11px", borderLeft: "2px dashed #CBD5E0", height: "16px" }} />

                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#FED7D7",
                            color: "#9B2C2C",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          D
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "#718096", textTransform: "uppercase", fontWeight: 700 }}>
                            DELIVER TO FARMER
                          </div>
                           <div style={{ fontSize: "13px", fontWeight: 700, color: "#2D3748" }}>
                             {order.drop_name || order.customer_name}
                           </div>
                           <div style={{ fontSize: "12px", color: "#4A5568" }}>
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
                        padding: "14px",
                        backgroundColor: "#38A169",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 10px rgba(56, 161, 105, 0.3)",
                      }}
                    >
                      {actionLoading === order.order_number ? (
                        "Accepting Trip..."
                      ) : (
                        <>
                          ACCEPT ORDER <ArrowRight size={18} />
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
            <div style={{ fontSize: "12px", color: "#718096", marginBottom: "12px", fontWeight: 600 }}>
              YOUR CURRENT DELIVERIES IN PROGRESS
            </div>

            {activeOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "48px 20px",
                  textAlign: "center",
                  border: "1px dashed #CBD5E0",
                }}
              >
                <Package size={44} style={{ color: "#CBD5E0", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", color: "#2D3748", marginBottom: "4px" }}>No active trips</h3>
                <p style={{ fontSize: "13px", color: "#718096" }}>
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
                        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                        border: "2px solid #2B6CB0",
                        padding: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid #EDF2F7",
                          paddingBottom: "10px",
                          marginBottom: "14px",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "12px", color: "#718096" }}>ACTIVE MISSION</span>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#2D3748" }}>
                            #{order.order_number}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              backgroundColor: "#EBF8FF",
                              color: "#2B6CB0",
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            {status.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#38A169", marginTop: "2px" }}>
                            Payout: ₹60
                          </div>
                        </div>
                      </div>

                      {/* Customer Contact Card */}
                      <div
                        style={{
                          backgroundColor: "#F7FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          padding: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ fontSize: "11px", color: "#718096", textTransform: "uppercase", fontWeight: 700 }}>
                          FARMER RECIPIENT
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#2D3748", marginTop: "2px" }}>
                          {order.customer_name || order.drop_name}
                        </div>
                        <div style={{ fontSize: "13px", color: "#4A5568", marginTop: "2px" }}>
                          {order.address || order.drop_address}
                        </div>

                        {(order.phone || order.drop_phone) && (
                          <a
                            href={`tel:${order.phone || order.drop_phone}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              backgroundColor: "#C6F6D5",
                              color: "#22543D",
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
                          <div style={{ fontSize: "12px", color: "#718096", marginBottom: "8px" }}>
                            Step 1: Arrive at Store Counter and pick up the package
                          </div>
                          <button
                            disabled={actionLoading === order.order_number}
                            onClick={() => handleStatusUpdate(order.order_number, "picked_up")}
                            style={{
                              width: "100%",
                              padding: "14px",
                              backgroundColor: "#3182CE",
                              color: "#FFF",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: 800,
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                          >
                            📦 CONFIRM PACKAGE PICKED UP FROM SHOP
                          </button>
                        </div>
                      )}

                      {isPickedUp && (
                        <div>
                          <div style={{ fontSize: "12px", color: "#718096", marginBottom: "8px" }}>
                            Step 2: Start riding toward the farm delivery location
                          </div>
                          <button
                            disabled={actionLoading === order.order_number}
                            onClick={() => handleStatusUpdate(order.order_number, "out_for_delivery")}
                            style={{
                              width: "100%",
                              padding: "14px",
                              backgroundColor: "#DD6B20",
                              color: "#FFF",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: 800,
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                          >
                            🛵 START RIDE (OUT FOR DELIVERY)
                          </button>
                        </div>
                      )}

                      {isOut && (
                        <div>
                          <div style={{ fontSize: "12px", color: "#718096", marginBottom: "8px" }}>
                            Step 3: Hand over package to farmer & collect payment
                          </div>
                          <div
                            style={{
                              backgroundColor: "#FEFCBF",
                              border: "1px solid #FAF089",
                              padding: "10px",
                              borderRadius: "8px",
                              marginBottom: "10px",
                              fontSize: "13px",
                              color: "#744210",
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
                              backgroundColor: "#38A169",
                              color: "#FFF",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: 800,
                              fontSize: "14px",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(56, 161, 105, 0.4)",
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
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>TODAY'S EARNINGS</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#22543D", margin: "4px 0" }}>
                  ₹{(earnings.today_earnings || 0).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "12px", color: "#718096" }}>{earnings.today_deliveries || 0} drops completed</div>
              </div>

              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>LIFETIME PAYOUT</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#2B6CB0", margin: "4px 0" }}>
                  ₹{(earnings.total_earnings || 0).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "12px", color: "#718096" }}>{earnings.total_deliveries || 0} total trips</div>
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#718096", marginBottom: "12px", fontWeight: 600 }}>
              COMPLETED TRIPS HISTORY
            </div>

            {completedOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "36px 16px",
                  textAlign: "center",
                  border: "1px dashed #CBD5E0",
                }}
              >
                <Clock size={36} style={{ color: "#CBD5E0", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "13px", color: "#718096" }}>Completed trips will appear here for payout record.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {completedOrders.map((order) => (
                  <div
                    key={order.order_number}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      padding: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                       <div style={{ fontSize: "14px", fontWeight: 700, color: "#2D3748" }}>
                         #{order.order_number} • {order.customer_name || order.drop_name}
                       </div>
                       <div style={{ fontSize: "12px", color: "#718096" }}>
                         {order.address || order.drop_address || "Delivered"} • {order.delivered_at ? new Date(order.delivered_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Delivered"}
                       </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#22543D" }}>+ ₹60</div>
                      <span style={{ fontSize: "11px", color: "#38A169", fontWeight: 600 }}>Settled</span>
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
