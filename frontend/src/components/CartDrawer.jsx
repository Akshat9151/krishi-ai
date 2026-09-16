import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Minus, Trash2, CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { storeApi } from "../services/api";
import { getProductImage } from "../utils/productImages";

export default function CartDrawer({ onNavigateOrders }) {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, totalAmount, recordOrder } = useCart();
  const { user, preferences } = useAuth();
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState(user ? user.username : "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(preferences?.farmLocation || "");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState("");
  const drawerRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isCartOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusableElements = drawerRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const closeDrawer = () => {
    setIsCartOpen(false);
    setOrderSuccess(null);
    setCheckoutOpen(false);
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
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
        payment_method: paymentMethod,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };
      const response = await storeApi.createOrder(orderPayload);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#E8A33D", "#C1440E", "#4C7A3A"] });

      const newOrder = {
        order_number: response.order_number || `ORD${Date.now()}`,
        total_amount: response.total_amount || totalAmount,
        status: response.status || "confirmed",
        payment_method: paymentMethod,
        created_at: response.created_at || new Date().toISOString(),
        customer_name: customerName,
        phone,
        address,
        items: response.items || [...items],
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
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end", backgroundColor: "rgba(43, 33, 24, 0.45)", backdropFilter: "blur(2px)" }} onClick={closeDrawer}>
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        style={{ width: "100%", maxWidth: "420px", height: "100%", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.12)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid var(--card-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={20} color="var(--terracotta)" />
            <h2 id="cart-drawer-title" style={{ fontSize: "17px", fontWeight: "700", margin: 0 }}>{t("cart", "Your AgriCart")} ({items.length})</h2>
          </div>
          <button ref={closeButtonRef} onClick={closeDrawer} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px", color: "var(--text-secondary)" }} aria-label="Close cart"><X size={20} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          {orderSuccess ? (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
              <CheckCircle2 size={54} color="var(--growth-green)" />
              <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "16px 0 8px" }}>Order Placed</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px" }}>Order #{orderSuccess.order_number}</p>
              <div className="ka-card" style={{ textAlign: "left", margin: "18px 0", padding: "14px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Delivery to: <strong>{orderSuccess.address}</strong></p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>Payment: <strong>{orderSuccess.payment_method === "online" ? "Online test payment successful" : "Cash on Delivery"}</strong></p>
                <p style={{ fontSize: "14px", fontWeight: "700", marginTop: "6px" }}>Total: ₹{orderSuccess.total_amount}</p>
              </div>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => { closeDrawer(); if (onNavigateOrders) onNavigateOrders(); }}><span>Track Order</span><ArrowRight size={16} /></button>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 10px" }}>
              <span style={{ fontSize: "48px" }}>🌾</span>
              <h4 style={{ fontSize: "16px", marginTop: "12px" }}>{t("cartEmpty", "Your cart is empty")}</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>{t("storeSubheader", "Explore seeds, fertilizers, and farm equipment in the AgriStore.")}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", backgroundColor: "var(--bg-cream)" }}>
                  <img src={getProductImage(item, 120)} alt={item.name} style={{ width: "56px", height: "56px", borderRadius: "6px", objectFit: "cover", backgroundColor: "#FFF", border: "1px solid var(--card-border)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ fontSize: "13.5px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h5>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>₹{item.price} • {item.unit}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ width: "30px", height: "30px", border: "1px solid var(--card-border)", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Decrease quantity"><Minus size={12} /></button>
                      <span style={{ fontSize: "13px", fontWeight: "700", minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ width: "30px", height: "30px", border: "1px solid var(--card-border)", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Increase quantity"><Plus size={12} /></button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--terracotta)" }}>₹{item.price * item.quantity}</p>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", marginTop: "8px", padding: "8px" }} title="Remove item" aria-label="Remove item"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}

              {!checkoutOpen ? (
                <div className="ka-card" style={{ marginTop: "12px", textAlign: "center" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "700" }}>Ready to checkout?</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12.5px", marginTop: "6px" }}>Review delivery details and choose COD or online test payment.</p>
                  <button className="btn-primary" style={{ width: "100%", marginTop: "14px" }} onClick={() => setCheckoutOpen(true)}><ArrowRight size={16} /><span>Proceed to Checkout</span></button>
                </div>
              ) : (
                <form className="ka-card" style={{ marginTop: "12px" }} onSubmit={handleCheckout}>
                  <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px" }}>Checkout & Delivery Details</h4>
                  {error && <div role="alert" aria-live="assertive" style={{ padding: "8px 12px", background: "var(--terracotta-light)", color: "var(--terracotta)", borderRadius: "6px", fontSize: "12.5px", marginBottom: "10px" }}>{error}</div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div><label className="input-label" htmlFor="checkout-customer-name">Farmer Name</label><input id="checkout-customer-name" className="input-field" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required /></div>
                    <div><label className="input-label" htmlFor="checkout-phone">Mobile Number</label><input id="checkout-phone" type="tel" className="input-field" placeholder="10-digit mobile number" value={phone} onChange={(event) => setPhone(event.target.value)} required /></div>
                    <div><label className="input-label" htmlFor="checkout-address">Saved Farm Location / Address</label><textarea id="checkout-address" rows={2} className="input-field" value={address} onChange={(event) => setAddress(event.target.value)} required /></div>
                    <div>
                      <label className="input-label">Payment Method</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", border: `1px solid ${paymentMethod === "cod" ? "var(--terracotta)" : "var(--card-border)"}`, borderRadius: "var(--radius-sm)", background: paymentMethod === "cod" ? "var(--terracotta-light)" : "#FFFFFF" }}><input type="radio" name="payment-method" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /><span style={{ fontSize: "12px", fontWeight: "600" }}>Cash on Delivery</span></label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", border: `1px solid ${paymentMethod === "online" ? "var(--terracotta)" : "var(--card-border)"}`, borderRadius: "var(--radius-sm)", background: paymentMethod === "online" ? "var(--terracotta-light)" : "#FFFFFF" }}><input type="radio" name="payment-method" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} /><span style={{ fontSize: "12px", fontWeight: "600" }}>Online (Test)</span></label>
                      </div>
                      {paymentMethod === "online" && <p style={{ color: "var(--text-muted)", fontSize: "11.5px", marginTop: "6px" }}>Test mode only: payment is simulated and no gateway is connected.</p>}
                    </div>
                  </div>
                  <button type="button" className="btn-outline" style={{ width: "100%", marginTop: "14px" }} onClick={() => setCheckoutOpen(false)}>Back to Cart</button>
                </form>
              )}
            </div>
          )}
        </div>

        {!orderSuccess && items.length > 0 && <div style={{ padding: "16px 20px", borderTop: "1px solid var(--card-border)", backgroundColor: "#FFFFFF" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "var(--text-secondary)" }}><span>Subtotal:</span><span>₹{totalAmount}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px", color: "var(--growth-green)" }}><span>Village Delivery:</span><span style={{ fontWeight: "700" }}>FREE</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "16px", fontWeight: "800" }}><span>{t("total", "Total Payable")}:</span><span style={{ color: "var(--terracotta)" }}>₹{totalAmount}</span></div>
          {checkoutOpen ? <button className="btn-primary" style={{ width: "100%", padding: "12px" }} onClick={handleCheckout} disabled={loading}>{loading ? "Placing Order..." : `Place Order (${paymentMethod === "online" ? "Online Test Payment" : "Cash on Delivery"}) • ₹${totalAmount}`}</button> : <button className="btn-primary" style={{ width: "100%", padding: "12px" }} onClick={() => setCheckoutOpen(true)}><ArrowRight size={16} /><span>Proceed to Checkout • ₹{totalAmount}</span></button>}
          <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>{checkoutOpen ? (paymentMethod === "online" ? "Online payment is a simulated test-mode step." : "Pay by cash when delivered at your doorstep.") : "Review your order before confirming delivery details."}</p>
        </div>}
      </div>
    </div>
  );
}
