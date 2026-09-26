import React, { useState, useEffect, useCallback } from "react";
import {
  Store,
  Clock,
  CheckCircle2,
  Package,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  LogOut,
  ChevronRight,
  TrendingUp,
  Boxes,
  Bell,
  Check,
  X,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  Tag,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { shopApi } from "../services/api";

export default function ShopDashboard({ setCurrentView }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "inventory" | "coupons"
  const [orderFilter, setOrderFilter] = useState("all"); // "all" | "new" | "preparing" | "ready" | "completed"
  
  const [stats, setStats] = useState({
    total_orders: 0,
    new_orders: 0,
    preparing: 0,
    ready_for_pickup: 0,
    delivered: 0,
    total_revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventorySearch, setInventorySearch] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // orderNumber currently being updated
  const [toastMessage, setToastMessage] = useState("");
  const [apiError, setApiError] = useState(""); // surface backend errors visibly
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    max_discount_amount: "",
    min_order_value: "",
    valid_from: "",
    valid_until: "",
    usage_limit_per_user: 1,
    total_usage_limit: "",
    applies_to: "all",
    new_users_only: false,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await shopApi.getStats();
      console.log("[ShopDashboard] stats response:", res);
      if (res && !res.detail) {
        setStats(res);
        setApiError("");
      } else if (res?.detail) {
        setApiError(`Stats error: ${res.detail}`);
      }
    } catch (err) {
      console.error("Failed to fetch shop stats:", err);
      setApiError(`Stats fetch failed: ${err.message}`);
    }
  }, []);

  const fetchOrders = useCallback(async (status) => {
    setLoadingOrders(true);
    try {
      const res = await shopApi.getOrders(status || orderFilter);
      console.log("[ShopDashboard] orders response:", res);
      if (Array.isArray(res)) {
        setOrders(res);
        setApiError("");
      } else if (res?.orders) {
        setOrders(res.orders);
        setApiError("");
      } else if (res?.detail) {
        setApiError(`Orders error: ${res.detail}`);
        setOrders([]);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch shop orders:", err);
      setApiError(`Orders fetch failed: ${err.message}`);
    } finally {
      setLoadingOrders(false);
    }
  }, [orderFilter]);

  const fetchInventory = useCallback(async () => {
    setLoadingInventory(true);
    try {
      const res = await shopApi.getInventory(inventorySearch);
      if (Array.isArray(res)) {
        setInventory(res);
      } else {
        setInventory([]);
      }
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoadingInventory(false);
    }
  }, [inventorySearch]);

  const fetchCoupons = useCallback(async () => {
    setLoadingCoupons(true);
    setCouponError("");
    try {
      const result = await shopApi.getCoupons();
      setCoupons(Array.isArray(result) ? result : []);
    } catch (err) {
      setCouponError(err.message || "Could not load coupons.");
    } finally {
      setLoadingCoupons(false);
    }
  }, []);

  const handleCreateCoupon = async (event) => {
    event.preventDefault();
    setCouponError("");
    try {
      await shopApi.createCoupon({
        ...couponForm,
        code: couponForm.code.trim().toUpperCase(),
        discount_value: Number(couponForm.discount_value),
        max_discount_amount: couponForm.max_discount_amount ? Number(couponForm.max_discount_amount) : null,
        min_order_value: couponForm.min_order_value ? Number(couponForm.min_order_value) : null,
        valid_from: couponForm.valid_from || null,
        valid_until: couponForm.valid_until || null,
        usage_limit_per_user: Number(couponForm.usage_limit_per_user),
        total_usage_limit: couponForm.total_usage_limit ? Number(couponForm.total_usage_limit) : null,
      });
      setCouponForm((form) => ({ ...form, code: "", discount_value: "" }));
      showToast("Coupon created.");
      await fetchCoupons();
    } catch (err) {
      setCouponError(err.message || "Could not create coupon.");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOrders(orderFilter);
    const interval = setInterval(() => {
      fetchStats();
      fetchOrders(orderFilter);
    }, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, [fetchStats, fetchOrders, orderFilter]);

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchInventory();
    }
  }, [activeTab, fetchInventory]);

  useEffect(() => {
    if (activeTab === "coupons") fetchCoupons();
  }, [activeTab, fetchCoupons]);

  const handleOrderAction = async (orderNumber, action, notes = "") => {
    setActionLoading(orderNumber);
    try {
      const res = await shopApi.updateOrderAction(orderNumber, action, notes);
      if (res?.error || res?.detail) {
        showToast(`❌ Error: ${res.detail || res.error}`);
      } else {
        showToast(`✅ Order ${orderNumber} updated: ${action.replace("_", " ")}`);
        fetchStats();
        fetchOrders(orderFilter);
      }
    } catch (err) {
      showToast(`❌ Update failed: ${err.message || "Network error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStock = async (item) => {
    const newStock = !item.in_stock;
    try {
      await shopApi.updateStock(item.id, { in_stock: newStock });
      setInventory((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, in_stock: newStock } : p))
      );
      showToast(`Item ${item.name} marked ${newStock ? "In Stock" : "Out of Stock"}`);
    } catch (err) {
      showToast("❌ Failed to update stock status");
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-cream, #FAF8F5)", paddingBottom: "60px" }}>
      {/* Top Header */}
      <header
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid var(--card-border, #E6DEC8)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              backgroundColor: "rgba(196, 92, 53, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--terracotta, #C45C35)",
            }}
          >
            <Store size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "700", color: "var(--soil-dark, #24201D)", margin: 0 }}>
              Shop & Agency Partner Hub
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-secondary, #524B42)", margin: 0 }}>
              KhetiTak Store Management • {user?.username || "Merchant"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => {
              if (setCurrentView) setCurrentView("dashboard");
              else window.location.hash = "dashboard";
            }}
            className="btn btn-secondary"
            style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
          >
            🌱 Farmer App
          </button>
          <button
            onClick={() => {
              fetchStats();
              fetchOrders(orderFilter);
              if (activeTab === "inventory") fetchInventory();
              showToast("Refreshed!");
            }}
            className="btn btn-secondary"
            style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="btn"
            style={{
              padding: "8px 14px",
              backgroundColor: "#FFF5F5",
              color: "#C53030",
              border: "1px solid #FEB2B2",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Auth debug / error banner */}
      {apiError && (
        <div style={{
          background: "#FFF5F5", border: "1px solid #FC8181", borderRadius: "8px",
          margin: "12px 16px", padding: "12px 16px", fontSize: "13px", color: "#C53030",
          display: "flex", alignItems: "flex-start", gap: "8px"
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
          <div>
            <strong>Status update:</strong> {apiError}
          </div>
        </div>
      )}

      {/* Toast alert */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#24201D",
            color: "#FFF",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            zIndex: 9999,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Content wrapper */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 16px" }}>
        {/* KPI Summary Cards (Merchant Dashboard) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "14px", border: "1px solid var(--card-border, #E6DEC8)", borderLeft: "4px solid var(--terracotta, #C1440E)", boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)" }}>
            <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", fontWeight: 700 }}>NEW ORDERS</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--terracotta, #C1440E)", marginTop: "4px" }}>
              {stats.new_orders || 0}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-sub, #5C554E)", marginTop: "2px" }}>Action needed</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "14px", border: "1px solid var(--card-border, #E6DEC8)", borderLeft: "4px solid var(--marigold, #E8A33D)", boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)" }}>
            <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", fontWeight: 700 }}>PREPARING / PACKING</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--marigold, #E8A33D)", marginTop: "4px" }}>
              {stats.preparing || 0}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-sub, #5C554E)", marginTop: "2px" }}>In shop prep</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "14px", border: "1px solid var(--card-border, #E6DEC8)", borderLeft: "4px solid var(--soil-dark, #24201D)", boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)" }}>
            <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", fontWeight: 700 }}>READY FOR RIDER</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--soil-dark, #24201D)", marginTop: "4px" }}>
              {stats.ready_for_pickup || 0}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-sub, #5C554E)", marginTop: "2px" }}>Awaiting pickup</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "14px", border: "1px solid var(--card-border, #E6DEC8)", borderLeft: "4px solid var(--growth-green, #4C7A3A)", boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)" }}>
            <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", fontWeight: 700 }}>COMPLETED</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--growth-green, #4C7A3A)", marginTop: "4px" }}>
              {stats.delivered || 0}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-sub, #5C554E)", marginTop: "2px" }}>Successfully delivered</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "14px", border: "1px solid var(--card-border, #E6DEC8)", borderLeft: "4px solid var(--terracotta, #C1440E)", boxShadow: "0 2px 8px rgba(36, 32, 29, 0.04)" }}>
            <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", fontWeight: 700 }}>DEALER PAYOUT</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--soil-dark, #24201D)", marginTop: "4px" }}>
              ₹{(stats.total_revenue || 0).toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-sub, #5C554E)", marginTop: "2px" }}>Gross sales</div>
          </div>
        </div>

        {/* Tab switcher: Live Orders vs Inventory */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid var(--card-border, #E6DEC8)",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "orders" ? "3px solid var(--terracotta, #C1440E)" : "3px solid transparent",
              fontWeight: 700,
              fontSize: "14px",
              color: activeTab === "orders" ? "var(--terracotta, #C1440E)" : "var(--text-sub, #5C554E)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Package size={16} /> Live Orders & Fulfilment
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            style={{
              padding: "10px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "inventory" ? "3px solid var(--terracotta, #C1440E)" : "3px solid transparent",
              fontWeight: 700,
              fontSize: "14px",
              color: activeTab === "inventory" ? "var(--terracotta, #C1440E)" : "var(--text-sub, #5C554E)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Boxes size={16} /> Inventory & Stock
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            style={{
              padding: "10px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "coupons" ? "3px solid var(--terracotta, #C1440E)" : "3px solid transparent",
              fontWeight: 700,
              fontSize: "14px",
              color: activeTab === "coupons" ? "var(--terracotta, #C1440E)" : "var(--text-sub, #5C554E)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Tag size={16} /> Coupons
          </button>
        </div>

        {/* ================= TAB 1: LIVE ORDERS ================= */}
        {activeTab === "orders" && (
          <div>
            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "12px" }}>
              {[
                { key: "all", label: "All Orders" },
                { key: "new", label: `Incoming (${stats.new_orders || 0})` },
                { key: "preparing", label: `Preparing (${stats.preparing || 0})` },
                { key: "ready", label: `Ready for Rider (${stats.ready_for_pickup || 0})` },
                { key: "completed", label: "Completed" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setOrderFilter(f.key);
                    fetchOrders(f.key);
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: orderFilter === f.key ? "1px solid var(--terracotta, #C1440E)" : "1px solid var(--card-border, #E6DEC8)",
                    backgroundColor: orderFilter === f.key ? "rgba(193, 68, 14, 0.1)" : "#FFFFFF",
                    color: orderFilter === f.key ? "var(--terracotta, #C1440E)" : "var(--text-sub, #5C554E)",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loadingOrders ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-sub, #5C554E)" }}>
                <RefreshCw size={24} className="spin" style={{ marginBottom: "8px" }} />
                <p>Loading live merchant orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  padding: "48px 24px",
                  borderRadius: "14px",
                  border: "1px dashed var(--card-border, #E6DEC8)",
                  textAlign: "center",
                }}
              >
                <Package size={48} style={{ color: "var(--card-border, #E6DEC8)", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", color: "var(--soil-dark, #24201D)", marginBottom: "4px", fontWeight: 700 }}>No orders in this stage</h3>
                <p style={{ fontSize: "13px", color: "var(--text-sub, #5C554E)" }}>New farmer orders will appear here automatically.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {orders.map((order) => {
                  const status = (order.status || "confirmed").toLowerCase();
                  const isIncoming = status === "confirmed" || status === "placed";
                  const isPreparing = status === "preparing";
                  const isReady = status === "ready_for_pickup";
                  const isPickedUp = status === "picked_up" || status === "out_for_delivery";
                  const isDelivered = status === "delivered";

                  let statusBadge = { bg: "rgba(36, 32, 29, 0.08)", color: "#5C554E", label: status };
                  if (isIncoming) statusBadge = { bg: "rgba(232, 163, 61, 0.18)", color: "var(--terracotta, #C1440E)", label: "New Order • Action Required" };
                  if (isPreparing) statusBadge = { bg: "rgba(193, 68, 14, 0.12)", color: "var(--terracotta, #C1440E)", label: "Preparing in Shop" };
                  if (isReady) statusBadge = { bg: "rgba(232, 163, 61, 0.22)", color: "var(--soil-dark, #24201D)", label: "Ready for Rider" };
                  if (isPickedUp) statusBadge = { bg: "rgba(36, 32, 29, 0.08)", color: "var(--soil-dark, #24201D)", label: "Rider Out For Delivery" };
                  if (isDelivered) statusBadge = { bg: "rgba(76, 122, 58, 0.12)", color: "var(--growth-green, #4C7A3A)", label: "Delivered & Settled" };

                  return (
                    <div
                      key={order.order_number}
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "14px",
                        border: isIncoming ? "1.5px solid var(--terracotta, #C1440E)" : "1px solid var(--card-border, #E6DEC8)",
                        padding: "18px",
                        boxShadow: isIncoming ? "0 4px 14px rgba(193, 68, 14, 0.12)" : "0 2px 8px rgba(36, 32, 29, 0.04)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          borderBottom: "1px solid var(--card-border, #E6DEC8)",
                          paddingBottom: "12px",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--soil-dark, #24201D)" }}>
                              #{order.order_number}
                            </span>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: 700,
                                backgroundColor: statusBadge.bg,
                                color: statusBadge.color,
                              }}
                            >
                              {statusBadge.label}
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", marginTop: "4px" }}>
                            Placed {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"}
                            {" • "} Payment: <strong>{order.payment_method || "COD"}</strong>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--terracotta, #C1440E)" }}>
                            ₹{(order.total_amount || 0).toLocaleString("en-IN")}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)" }}>
                            Farmer pays • {order.items?.length || 1} item(s)
                          </div>
                          {order.discount_amount > 0 && <div style={{ fontSize: "12px", color: "var(--growth-green, #4C7A3A)" }}>{order.discount_label}: -₹{Number(order.discount_amount).toFixed(2)}</div>}
                          <div style={{ fontSize: "12px", color: "var(--text-sub, #5C554E)", marginTop: "3px" }}>Dealer payout: ₹{Number(order.dealer_payout_amount ?? order.total_amount ?? 0).toLocaleString("en-IN")}</div>
                        </div>
                      </div>

                      {/* Customer Delivery info */}
                      <div
                        style={{
                          backgroundColor: "var(--bg-cream, #FAF8F5)",
                          border: "1px solid var(--card-border, #E6DEC8)",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          marginBottom: "12px",
                          fontSize: "13px",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <span style={{ color: "var(--text-sub, #5C554E)", fontWeight: 600 }}>Farmer / Customer:</span>
                          <div style={{ fontWeight: 700, color: "var(--soil-dark, #24201D)" }}>{order.customer_name || "Valued Farmer"}</div>
                          {order.phone && (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--growth-green, #4C7A3A)", fontWeight: 600, marginTop: "2px" }}>
                              <Phone size={12} /> {order.phone}
                            </div>
                          )}
                        </div>
                        <div>
                          <span style={{ color: "var(--text-sub, #5C554E)", fontWeight: 600 }}>Delivery Address:</span>
                          <div style={{ color: "var(--soil-dark, #24201D)", display: "flex", alignItems: "flex-start", gap: "4px", marginTop: "2px" }}>
                            <MapPin size={14} style={{ marginTop: "2px", flexShrink: 0, color: "var(--terracotta, #C1440E)" }} />
                            <span>{order.address || "Address not provided"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items table */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-sub, #5C554E)", marginBottom: "6px", textTransform: "uppercase" }}>
                          Order Items
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyBetween: "space-between",
                                justifyContent: "space-between",
                                fontSize: "13px",
                                padding: "4px 0",
                                borderBottom: "1px dashed var(--card-border, #E6DEC8)",
                              }}
                            >
                              <div>
                                <span style={{ fontWeight: 600, color: "var(--soil-dark, #24201D)" }}>{item.name || item.product_name || "Agri Supply Item"}</span>
                                <span style={{ color: "var(--text-sub, #5C554E)", marginLeft: "6px" }}>x {item.quantity}</span>
                              </div>
                              <div style={{ fontWeight: 700, color: "var(--soil-dark, #24201D)" }}>
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {isIncoming && (
                          <>
                            <button
                              disabled={actionLoading === order.order_number}
                              onClick={() => handleOrderAction(order.order_number, "reject")}
                              style={{
                                padding: "9px 16px",
                                borderRadius: "8px",
                                border: "1px solid #FEB2B2",
                                background: "#FFF",
                                color: "#C53030",
                                fontWeight: 700,
                                fontSize: "13px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <X size={15} /> Decline
                            </button>
                            <button
                              disabled={actionLoading === order.order_number}
                              onClick={() => handleOrderAction(order.order_number, "accept")}
                              style={{
                                padding: "9px 20px",
                                borderRadius: "8px",
                                border: "none",
                                background: "var(--terracotta, #C1440E)",
                                color: "#FFF",
                                fontWeight: 700,
                                fontSize: "13px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                boxShadow: "0 2px 8px rgba(193, 68, 14, 0.25)",
                              }}
                            >
                              <Check size={15} /> Accept Order (Start Packing)
                            </button>
                          </>
                        )}

                        {isPreparing && (
                          <button
                            disabled={actionLoading === order.order_number}
                            onClick={() => handleOrderAction(order.order_number, "ready")}
                            style={{
                              padding: "9px 20px",
                              borderRadius: "8px",
                              border: "none",
                              background: "var(--terracotta, #C1440E)",
                              color: "#FFF",
                              fontWeight: 700,
                              fontSize: "13px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              boxShadow: "0 2px 8px rgba(193, 68, 14, 0.25)",
                            }}
                          >
                            <CheckCircle2 size={15} /> Packed & Ready For Rider Pickup
                          </button>
                        )}

                        {isReady && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--terracotta, #C1440E)", fontWeight: 700 }}>
                            <Clock size={16} /> Waiting for delivery rider to accept & pick up...
                          </div>
                        )}

                        {isPickedUp && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--soil-dark, #24201D)", fontWeight: 700 }}>
                            <CheckCircle2 size={16} /> Rider has picked up package • In transit to farmer
                          </div>
                        )}

                        {isDelivered && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--growth-green, #4C7A3A)", fontWeight: 700 }}>
                            <CheckCircle2 size={16} /> Order Completed & Delivered
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: INVENTORY MANAGEMENT ================= */}
        {activeTab === "inventory" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ position: "relative", minWidth: "260px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#524B42" }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  style={{
                    padding: "9px 12px 9px 36px",
                    borderRadius: "8px",
                    border: "1px solid #E6DEC8",
                    width: "100%",
                    fontSize: "13px",
                  }}
                />
              </div>
              <button
                onClick={fetchInventory}
                className="btn btn-secondary"
                style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
              >
                <RefreshCw size={14} /> Refresh Catalog
              </button>
            </div>

            {loadingInventory ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <RefreshCw size={24} className="spin" style={{ margin: "0 auto 8px" }} />
                <p>Loading shop inventory...</p>
              </div>
            ) : inventory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", background: "#FFF", borderRadius: "12px" }}>
                <Boxes size={48} style={{ color: "#E6DEC8", margin: "0 auto 12px" }} />
                <p>No products found matching your filter.</p>
              </div>
            ) : (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E6DEC8",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #E6DEC8" }}>
                    <tr>
                      <th style={{ padding: "12px 16px", color: "#524B42" }}>Product Name</th>
                      <th style={{ padding: "12px 16px", color: "#524B42" }}>Category</th>
                      <th style={{ padding: "12px 16px", color: "#524B42" }}>Selling Price</th>
                      <th style={{ padding: "12px 16px", color: "#524B42" }}>Stock Status</th>
                      <th style={{ padding: "12px 16px", color: "#524B42", textAlign: "right" }}>Toggle Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #F0EAE1" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#24201D" }}>
                          {item.name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#524B42", textTransform: "capitalize" }}>
                          {item.category || "General"}
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--terracotta, #C1440E)" }}>
                          ₹{item.price}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 700,
                              backgroundColor: item.in_stock ? "rgba(76, 122, 58, 0.12)" : "#FFF5F5",
                              color: item.in_stock ? "var(--growth-green, #4C7A3A)" : "#C53030",
                            }}
                          >
                            {item.in_stock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <button
                            onClick={() => handleToggleStock(item)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: item.in_stock ? "var(--growth-green, #4C7A3A)" : "#C53030",
                              fontSize: "13px",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {item.in_stock ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            {item.in_stock ? "Active" : "Disabled"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "coupons" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "16px" }}>
                <form className="ka-card" onSubmit={handleCreateCoupon} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h2 style={{ margin: 0, fontSize: "17px" }}>Create Coupon</h2>
                  {couponError && <p role="alert" style={{ color: "#C53030", fontSize: "13px", margin: 0 }}>{couponError}</p>}
                  <label className="input-label">Coupon code<input className="input-field" required minLength={3} maxLength={64} value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} placeholder="WELCOME15" /></label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <label className="input-label">Discount type<select className="input-field" value={couponForm.discount_type} onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}><option value="percentage">Percentage</option><option value="flat_amount">Flat amount (₹)</option></select></label>
                    <label className="input-label">Discount value<input className="input-field" type="number" required min="0.01" step="0.01" max={couponForm.discount_type === "percentage" ? "100" : undefined} value={couponForm.discount_value} onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })} /></label>
                  </div>
                  {couponForm.discount_type === "percentage" && <label className="input-label">Maximum discount (₹, optional)<input className="input-field" type="number" min="0.01" step="0.01" value={couponForm.max_discount_amount} onChange={(e) => setCouponForm({ ...couponForm, max_discount_amount: e.target.value })} /></label>}
                  <label className="input-label">Minimum order value (₹, optional)<input className="input-field" type="number" min="0" step="0.01" value={couponForm.min_order_value} onChange={(e) => setCouponForm({ ...couponForm, min_order_value: e.target.value })} /></label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <label className="input-label">Valid from<input className="input-field" type="date" value={couponForm.valid_from} onChange={(e) => setCouponForm({ ...couponForm, valid_from: e.target.value })} /></label>
                    <label className="input-label">Valid until<input className="input-field" type="date" value={couponForm.valid_until} onChange={(e) => setCouponForm({ ...couponForm, valid_until: e.target.value })} /></label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <label className="input-label">Uses per farmer<input className="input-field" type="number" required min="1" step="1" value={couponForm.usage_limit_per_user} onChange={(e) => setCouponForm({ ...couponForm, usage_limit_per_user: e.target.value })} /></label>
                    <label className="input-label">Total uses (optional)<input className="input-field" type="number" min="1" step="1" value={couponForm.total_usage_limit} onChange={(e) => setCouponForm({ ...couponForm, total_usage_limit: e.target.value })} /></label>
                  </div>
                  <label className="input-label">Applies to category (or all)<input className="input-field" value={couponForm.applies_to} onChange={(e) => setCouponForm({ ...couponForm, applies_to: e.target.value || "all" })} placeholder="all" /></label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}><input type="checkbox" checked={couponForm.new_users_only} onChange={(e) => setCouponForm({ ...couponForm, new_users_only: e.target.checked })} /> New users only (no prior orders)</label>
                  <button className="btn-primary" type="submit">Create Coupon</button>
                </form>

                <div className="ka-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <h2 style={{ margin: 0, fontSize: "17px" }}>Coupons</h2>
                    <button type="button" className="btn-outline" onClick={fetchCoupons}>Refresh</button>
                  </div>
                  {loadingCoupons ? <p>Loading coupons...</p> : coupons.length === 0 ? <p style={{ color: "var(--text-secondary)" }}>No coupons created yet.</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
                      {coupons.map((coupon) => (
                        <div key={coupon.id} style={{ padding: "12px", border: "1px solid var(--card-border)", borderRadius: "8px" }}>
                          <strong>{coupon.code}</strong>
                          <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                            {coupon.discount_type === "percentage" ? `${coupon.discount_value}% off` : `₹${coupon.discount_value} off`}
                            {coupon.max_discount_amount ? ` (max ₹${coupon.max_discount_amount})` : ""}
                            {coupon.min_order_value ? ` • min order ₹${coupon.min_order_value}` : ""}
                            {coupon.new_users_only ? " • new users only" : ""}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                            {coupon.valid_from || "Now"} – {coupon.valid_until || "No end date"} • {coupon.is_active ? "Active" : "Inactive"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
