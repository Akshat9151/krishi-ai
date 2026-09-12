import React, { useState } from "react";
import { X, Plus, Minus, Trash2, CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { storeApi } from "../services/api";

export default function CartDrawer({ onNavigateOrders }) {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, totalAmount, recordOrder } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [customerName, setCustomerName] = useState(user ? user.username : "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState("");

  if (!isCartOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in your name, phone number, and delivery address.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        customer_name: customerName,
        phone,
        address,
        total_amount: totalAmount,
        payment_method: "cod",
        user_id: user ? user.id || 1 : null,
        items: items.map((i) => ({
          product_id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      };

      const res = await storeApi.createOrder(orderPayload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E8A33D", "#C1440E", "#4C7A3A"],
      });

      // Save order to history
      const newOrder = {
        order_number: res.order_number || `ORD${Date.now()}`,
        total_amount: res.total_amount || totalAmount,
        status: res.status || "confirmed",
        created_at: res.created_at || new Date().toISOString(),
        customer_name: customerName,
        phone,
        address,
        items: [...items],
      };
      recordOrder(newOrder);

      setOrderSuccess(newOrder);
      clearCart();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "rgba(43, 33, 24, 0.45)",
        backdropFilter: "blur(2px)",
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "100%",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid var(--card-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={20} color="var(--terracotta)" />
            <h3 style={{ fontSize: "17px", fontWeight: "700", margin: 0 }}>
              {t("cart", "Your AgriCart")} ({items.length})
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setOrderSuccess(null);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-secondary)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          {orderSuccess ? (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "var(--growth-green-light)",
                  color: "var(--growth-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px" }}>
                Order Placed Successfully!
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", marginBottom: "16px" }}>
                Order Number: <strong style={{ color: "var(--terracotta)" }}>{orderSuccess.order_number}</strong>
              </p>
              <div className="ka-card" style={{ textAlign: "left", marginBottom: "20px", padding: "14px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Delivery to: <strong>{orderSuccess.customer_name}</strong>
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Address: {orderSuccess.address}
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
                  Payment: <strong>Cash on Delivery (COD)</strong>
                </p>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginTop: "6px" }}>
                  Total Amount: ₹{orderSuccess.total_amount}
                </p>
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderSuccess(null);
                  if (onNavigateOrders) onNavigateOrders();
                }}
              >
                <span>Track My Orders</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 10px" }}>
              <span style={{ fontSize: "48px" }}>🌾</span>
              <h4 style={{ fontSize: "16px", marginTop: "12px", color: "var(--text-primary)" }}>
                {t("cartEmpty", "Your cart is empty")}
              </h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
                {t("storeSubheader", "Explore seeds, fertilizers, and farm equipment in the AgriStore.")}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Items List */}
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--card-border)",
                    backgroundColor: "var(--bg-cream)",
                  }}
                >
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=120"}
                    alt={item.name}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "6px",
                      objectFit: "cover",
                      backgroundColor: "#FFF",
                      border: "1px solid var(--card-border)",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5
                      style={{
                        fontSize: "13.5px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </h5>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      ₹{item.price} • {item.unit}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "4px",
                          border: "1px solid var(--card-border)",
                          background: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: "13px", fontWeight: "700", minWidth: "16px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "4px",
                          border: "1px solid var(--card-border)",
                          background: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--terracotta)" }}>
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        marginTop: "8px",
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Checkout Form */}
              <div className="ka-card" style={{ marginTop: "12px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>
                  Delivery Details (गाँव / पता)
                </h4>

                {error && (
                  <div style={{ padding: "8px 12px", background: "var(--terracotta-light)", color: "var(--terracotta)", borderRadius: "6px", fontSize: "12.5px", marginBottom: "10px" }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label className="input-label">Farmer Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="आपका नाम (Full Name)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Village / Farm Address</label>
                    <textarea
                      rows={2}
                      className="input-field"
                      placeholder="गाँव, तहसील, ज़िला, पिन कोड (Village & District)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {!orderSuccess && items.length > 0 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--card-border)",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <span>Subtotal:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px", color: "var(--growth-green)" }}>
              <span>Village Delivery:</span>
              <span style={{ fontWeight: "700" }}>FREE (मुफ़्त)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "16px", fontWeight: "800", color: "var(--text-primary)" }}>
              <span>{t("total", "Total Payable")}:</span>
              <span style={{ color: "var(--terracotta)" }}>₹{totalAmount}</span>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "12px" }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Placing Order..." : `${t("checkout", "Place Order (Cash on Delivery)")} • ₹${totalAmount}`}
            </button>
            <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
              Pay by cash or UPI when delivered at your doorstep.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
