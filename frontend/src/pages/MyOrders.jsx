import React, { useEffect, useState } from "react";
import { PackageCheck, Search, CheckCircle2, Clock, Truck, MapPin, ArrowRight } from "lucide-react";
import { storeApi } from "../services/api";
import OrderTracking from "../components/OrderTracking";

export default function MyOrders({ setCurrentView }) {
  const [searchNum, setSearchNum] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [accountOrders, setAccountOrders] = useState([]);
  const [cancellingOrder, setCancellingOrder] = useState("");

  useEffect(() => {
    let active = true;
    storeApi.getMyOrders()
      .then((orders) => {
        if (active) setAccountOrders(Array.isArray(orders) ? orders : []);
      })
      .catch((err) => {
        console.error("Failed to load account orders:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchNum.trim()) return;

    setLoading(true);
    setError("");
    setSearchedOrder(null);

    try {
      const data = await storeApi.getOrder(searchNum.trim());
      setSearchedOrder(data);
    } catch (err) {
      console.error(err);
      setError("Order not found. Please check your order number.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (order) => {
    if (!window.confirm("Cancel this COD order before dispatch?")) return;
    setCancellingOrder(order.order_number);
    setError("");
    try {
      const cancelled = await storeApi.cancelOrder(order.order_number);
      setAccountOrders((orders) => orders.map((item) => (
        item.order_number === cancelled.order_number ? cancelled : item
      )));
      if (searchedOrder?.order_number === cancelled.order_number) {
        setSearchedOrder(cancelled);
      }
    } catch (err) {
      setError(err.message || "This order cannot be cancelled.");
    } finally {
      setCancellingOrder("");
    }
  };

  const displayOrders = searchedOrder ? [searchedOrder] : accountOrders;

  if (trackingOrder) {
    return <OrderTracking order={trackingOrder} onBack={() => setTrackingOrder(null)} />;
  }

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)" }}>
          My Orders & Delivery Tracking (मेरे ऑर्डर)
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Track orders placed through KhetiTak AgriStore with live delivery status.
        </p>
      </div>

      {/* Order Search Bar */}
      <div className="ka-card">
        <form onSubmit={handleLookup} style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", top: "12px", left: "12px" }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search by Order Number (e.g. ORD1741...)"
              value={searchNum}
              onChange={(e) => setSearchNum(e.target.value)}
              style={{ paddingLeft: "38px" }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            <span>Track Order</span>
          </button>
          {searchedOrder && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setSearchedOrder(null);
                setSearchNum("");
              }}
            >
              Reset
            </button>
          )}
        </form>

        {error && (
          <p style={{ color: "var(--terracotta)", fontSize: "13px", marginTop: "8px" }}>
            {error}
          </p>
        )}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="ka-card" style={{ textAlign: "center", padding: "50px" }}>
          <span style={{ fontSize: "36px" }}>📦</span>
          <h4 style={{ fontSize: "16px", marginTop: "12px" }}>Searching order database...</h4>
          <div className="growing-bar" style={{ maxWidth: "200px", margin: "14px auto 0 auto" }}></div>
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="ka-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <span style={{ fontSize: "44px" }}>🛍️</span>
          <h4 style={{ fontSize: "17px", fontWeight: "700", marginTop: "12px" }}>
            No orders found
          </h4>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", maxWidth: "320px", margin: "8px auto 0 auto" }}>
            You haven't placed any orders yet. Visit AgriStore to browse certified seeds and fertilizers.
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: "16px" }}
            onClick={() => setCurrentView("store")}
          >
            <span>Explore AgriStore</span>
            <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {displayOrders.map((order, idx) => (
            <div
              key={order.order_number || idx}
              className="ka-card"
              style={{ padding: "20px", borderLeft: "5px solid var(--growth-green)" }}
            >
              {/* Order Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
                      Order #{order.order_number}
                    </h3>
                    <span className="badge-green">● Confirmed</span>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Placed on: {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Total Amount:</span>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: "var(--terracotta)", margin: 0 }}>
                    ₹{order.total_amount}
                  </p>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Payment: Cash on Delivery</span>
                </div>
              </div>

              {/* Delivery Details */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)", marginTop: "12px", padding: "8px 12px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)" }}>
                <MapPin size={15} color="var(--terracotta)" />
                <span>
                  Delivering to: <strong>{order.customer_name}</strong> • {order.address} ({order.phone})
                </span>
              </div>

              {/* Items in order */}
              {order.items && order.items.length > 0 && (
                <div style={{ marginTop: "14px" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--text-secondary)" }}>
                    ORDERED ITEMS ({order.items.length}):
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                    {order.items.map((it, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13.5px",
                          padding: "6px 0",
                          borderBottom: "1px dashed var(--card-border)",
                        }}
                      >
                        <span style={{ color: "var(--text-primary)" }}>
                          {it.name} <strong style={{ color: "var(--terracotta)" }}>× {it.quantity}</strong>
                        </span>
                        <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                          ₹{it.price * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                <button
                  className="btn-primary"
                  onClick={() => setTrackingOrder(order)}
                >
                  <Truck size={16} />
                  <span>Track Order</span>
                </button>
                {["confirmed", "processing", "placed"].includes(String(order.status).toLowerCase()) && (
                  <button
                    className="btn-outline"
                    disabled={cancellingOrder === order.order_number}
                    onClick={() => handleCancel(order)}
                  >
                    {cancellingOrder === order.order_number ? "Cancelling..." : "Cancel COD Order"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
