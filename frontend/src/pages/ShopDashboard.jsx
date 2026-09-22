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
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { shopApi } from "../services/api";

export default function ShopDashboard({ setCurrentView }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "inventory"
  const [orderFilter, setOrderFilter] = useState("all"); // "all" | "confirmed" | "preparing" | "ready_for_pickup" | "completed"
  
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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await shopApi.getStats();
      if (res && !res.detail) {
        setStats(res);
      }
    } catch (err) {
      console.error("Failed to fetch shop stats:", err);
    }
  }, []);

  const fetchOrders = useCallback(async (status) => {
    setLoadingOrders(true);
    try {
      const res = await shopApi.getOrders(status || orderFilter);
      if (Array.isArray(res)) {
        setOrders(res);
      } else if (res?.orders) {
        setOrders(res.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch shop orders:", err);
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
        {/* KPI Summary Cards (Zomato Merchant style) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "12px", border: "1px solid #E6DEC8", borderLeft: "4px solid #C45C35" }}>
            <div style={{ fontSize: "12px", color: "#524B42", fontWeight: 600 }}>NEW ORDERS</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#C45C35", marginTop: "4px" }}>
              {stats.new_orders || 0}
            </div>
            <div style={{ fontSize: "11px", color: "#6B645A", marginTop: "2px" }}>Action needed</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "12px", border: "1px solid #E6DEC8", borderLeft: "4px solid #DD6B20" }}>
            <div style={{ fontSize: "12px", color: "#524B42", fontWeight: 600 }}>PREPARING / PACKING</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#DD6B20", marginTop: "4px" }}>
              {stats.preparing || 0}
            </div>
            <div style={{ fontSize: "11px", color: "#6B645A", marginTop: "2px" }}>In shop prep</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "12px", border: "1px solid #E6DEC8", borderLeft: "4px solid #2B6CB0" }}>
            <div style={{ fontSize: "12px", color: "#524B42", fontWeight: 600 }}>READY FOR RIDER</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#2B6CB0", marginTop: "4px" }}>
              {stats.ready_for_pickup || 0}
            </div>
            <div style={{ fontSize: "11px", color: "#6B645A", marginTop: "2px" }}>Awaiting pickup</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "12px", border: "1px solid #E6DEC8", borderLeft: "4px solid #276749" }}>
            <div style={{ fontSize: "12px", color: "#524B42", fontWeight: 600 }}>COMPLETED</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#276749", marginTop: "4px" }}>
              {stats.delivered || 0}
            </div>
            <div style={{ fontSize: "11px", color: "#6B645A", marginTop: "2px" }}>Successfully delivered</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "16px", borderRadius: "12px", border: "1px solid #E6DEC8", borderLeft: "4px solid #319795" }}>
            <div style={{ fontSize: "12px", color: "#524B42", fontWeight: 600 }}>TOTAL REVENUE</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#24201D", marginTop: "4px" }}>
              ₹{(stats.total_revenue || 0).toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: "11px", color: "#6B645A", marginTop: "2px" }}>Gross sales</div>
          </div>
        </div>

        {/* Tab switcher: Live Orders vs Inventory */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid #E6DEC8",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "orders" ? "3px solid var(--terracotta, #C45C35)" : "3px solid transparent",
              fontWeight: 700,
              fontSize: "14px",
              color: activeTab === "orders" ? "var(--terracotta, #C45C35)" : "#524B42",
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
              borderBottom: activeTab === "inventory" ? "3px solid var(--terracotta, #C45C35)" : "3px solid transparent",
              fontWeight: 700,
              fontSize: "14px",
              color: activeTab === "inventory" ? "var(--terracotta, #C45C35)" : "#524B42",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Boxes size={16} /> Inventory & Stock
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
                    border: orderFilter === f.key ? "1px solid #C45C35" : "1px solid #E6DEC8",
                    backgroundColor: orderFilter === f.key ? "rgba(196, 92, 53, 0.1)" : "#FFFFFF",
                    color: orderFilter === f.key ? "#C45C35" : "#524B42",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loadingOrders ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#524B42" }}>
                <RefreshCw size={24} className="spin" style={{ marginBottom: "8px" }} />
                <p>Loading live merchant orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  padding: "48px 24px",
                  borderRadius: "12px",
                  border: "1px solid #E6DEC8",
                  textAlign: "center",
                }}
              >
                <Package size={48} style={{ color: "#E6DEC8", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "16px", color: "#24201D", marginBottom: "4px" }}>No orders in this stage</h3>
                <p style={{ fontSize: "13px", color: "#524B42" }}>New farmer orders will appear here automatically.</p>
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

                  let statusBadge = { bg: "#EDF2F7", color: "#4A5568", label: status };
                  if (isIncoming) statusBadge = { bg: "#FEFCBF", color: "#744210", label: "New Order • Action Required" };
                  if (isPreparing) statusBadge = { bg: "#FEEBC8", color: "#7B341E", label: "Preparing in Shop" };
                  if (isReady) statusBadge = { bg: "#BEE3F8", color: "#2A4365", label: "Ready for Rider" };
                  if (isPickedUp) statusBadge = { bg: "#EBF8FF", color: "#2B6CB0", label: "Rider Out For Delivery" };
                  if (isDelivered) statusBadge = { bg: "#C6F6D5", color: "#22543D", label: "Delivered & Settled" };

                  return (
                    <div
                      key={order.order_number}
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "12px",
                        border: isIncoming ? "2px solid #C45C35" : "1px solid #E6DEC8",
                        padding: "18px",
                        boxShadow: isIncoming ? "0 4px 12px rgba(196, 92, 53, 0.12)" : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          borderBottom: "1px solid #F0EAE1",
                          paddingBottom: "12px",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "800", color: "#24201D" }}>
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
                          <div style={{ fontSize: "12px", color: "#524B42", marginTop: "4px" }}>
                            Placed {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"}
                            {" • "} Payment: <strong>{order.payment_method || "COD"}</strong>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "18px", fontWeight: "800", color: "#C45C35" }}>
                            ₹{(order.total_amount || 0).toLocaleString("en-IN")}
                          </div>
                          <div style={{ fontSize: "12px", color: "#524B42" }}>
                            {order.items?.length || 1} item(s)
                          </div>
                        </div>
                      </div>

                      {/* Customer Delivery info */}
                      <div
                        style={{
                          backgroundColor: "#FAF8F5",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          marginBottom: "12px",
                          fontSize: "13px",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <span style={{ color: "#524B42", fontWeight: 600 }}>Farmer / Customer:</span>
                          <div style={{ fontWeight: 700, color: "#24201D" }}>{order.customer_name || "Valued Farmer"}</div>
                          {order.phone && (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#276749" }}>
                              <Phone size={12} /> {order.phone}
                            </div>
                          )}
                        </div>
                        <div>
                          <span style={{ color: "#524B42", fontWeight: 600 }}>Delivery Address:</span>
                          <div style={{ color: "#24201D", display: "flex", alignItems: "flex-start", gap: "4px" }}>
                            <MapPin size={14} style={{ marginTop: "2px", flexShrink: 0, color: "#C45C35" }} />
                            <span>{order.address || "Address not provided"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items table */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#524B42", marginBottom: "6px", textTransform: "uppercase" }}>
                          Order Items
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "13px",
                                padding: "4px 0",
                                borderBottom: "1px dashed #E6DEC8",
                              }}
                            >
                              <div>
                                <span style={{ fontWeight: 600, color: "#24201D" }}>{item.name || item.product_name || "Agri Supply Item"}</span>
                                <span style={{ color: "#524B42", marginLeft: "6px" }}>x {item.quantity}</span>
                              </div>
                              <div style={{ fontWeight: 600, color: "#24201D" }}>
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons (Zomato-style flow) */}
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {isIncoming && (
                          <>
                            <button
                              disabled={actionLoading === order.order_number}
                              onClick={() => handleOrderAction(order.order_number, "reject")}
                              style={{
                                padding: "9px 16px",
                                borderRadius: "8px",
                                border: "1px solid #E2E8F0",
                                background: "#FFF",
                                color: "#E53E3E",
                                fontWeight: 600,
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
                                background: "var(--terracotta, #C45C35)",
                                color: "#FFF",
                                fontWeight: 700,
                                fontSize: "13px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
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
                              background: "#2B6CB0",
                              color: "#FFF",
                              fontWeight: 700,
                              fontSize: "13px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <CheckCircle2 size={15} /> Packed & Ready For Rider Pickup
                          </button>
                        )}

                        {isReady && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#2B6CB0", fontWeight: 600 }}>
                            <Clock size={16} /> Waiting for delivery rider to accept & pick up...
                          </div>
                        )}

                        {isPickedUp && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#276749", fontWeight: 600 }}>
                            <CheckCircle2 size={16} /> Rider has picked up package • In transit to farmer
                          </div>
                        )}

                        {isDelivered && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#276749", fontWeight: 600 }}>
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
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#C45C35" }}>
                          ₹{item.price}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 600,
                              backgroundColor: item.in_stock ? "#C6F6D5" : "#FED7D7",
                              color: item.in_stock ? "#22543D" : "#9B2C2C",
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
                              color: item.in_stock ? "#276749" : "#C53030",
                              fontSize: "13px",
                              fontWeight: 600,
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
      </div>
    </div>
  );
}
