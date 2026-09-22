import React, { useEffect, useState } from "react";
import { storeApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

function OrderRow({ order, actions }) {
  return (
    <div className="ka-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <strong>{order.order_number}</strong>
        <span className="badge-green">{order.status.replaceAll("_", " ")}</span>
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
        {order.customer_name} · {order.address} · {money(order.total_amount)}
      </div>
      <div style={{ fontSize: "13px" }}>
        {order.items.map((item) => <div key={`${order.order_number}-${item.product_id}`}>{item.name} × {item.quantity}</div>)}
      </div>
      {actions}
    </div>
  );
}

export default function OperationsDashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      if (user?.role === "shop_owner") {
        const [incoming, inventory, summary] = await Promise.all([
          storeApi.getOwnerOrders(), storeApi.getOwnerProducts(), storeApi.getOwnerEarnings(),
        ]);
        setOrders(incoming); setProducts(inventory); setEarnings(summary);
      } else {
        const [available, assigned, riderEarnings] = await Promise.all([
          storeApi.getRiderOrders(),
          storeApi.getRiderDeliveries(),
          storeApi.getRiderEarnings(),
        ]);
        const byOrder = new Map([...available, ...assigned].map((order) => [order.order_number, order]));
        setOrders([...byOrder.values()]);
        setEarnings(riderEarnings);
      }
    } catch (err) { setError(err.message || "Unable to load dashboard"); }
  };
  useEffect(() => { load(); }, [user?.role]);

  const updateShopStatus = async (orderNumber, status, reason) => {
    try {
      const updated = await storeApi.updateOwnerOrderStatus(orderNumber, status, reason);
      setOrders((items) => items.map((item) => item.order_number === updated.order_number ? updated : item));
    } catch (err) { setError(err.message); }
  };

  const saveProduct = async (product) => {
    try {
      const updated = await storeApi.updateOwnerProduct(product.id, {
        name: product.name, price: Number(product.price), category: product.category, stock_quantity: Number(product.stock_quantity),
      });
      setProducts((items) => items.map((item) => item.id === updated.id ? updated : item));
    } catch (err) { setError(err.message); }
  };

  const claim = async (orderNumber) => {
    try {
      const updated = await storeApi.claimRiderOrder(orderNumber);
      setOrders((items) => items.filter((item) => item.order_number !== updated.order_number));
    } catch (err) { setError(err.message); }
  };

  const riderStatus = async (orderNumber, status) => {
    try { await storeApi.updateRiderStatus(orderNumber, status); await load(); }
    catch (err) { setError(err.message); }
  };

  const isShop = user?.role === "shop_owner";
  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "1180px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "var(--terracotta)", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>KhetiTak Partner Portal</p>
          <h2 style={{ margin: "5px 0 0" }}>{isShop ? "Shopkeeper Dashboard" : "Delivery Dashboard"}</h2>
          <p style={{ color: "var(--text-secondary)", margin: "5px 0 0" }}>Welcome back, {user?.username}</p>
        </div>
        <button className="btn-outline" onClick={logout}>Sign out</button>
      </div>
      {error && <div role="alert" style={{ color: "var(--terracotta)" }}>{error}</div>}
      {isShop ? (
        <>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div className="ka-card"><strong>{earnings?.order_count || 0}</strong><div>This month orders</div></div>
            <div className="ka-card"><strong>{money(earnings?.order_value)}</strong><div>This month value</div></div>
          </div>
          <h3>Incoming Orders</h3>
          {!orders.length && <div className="ka-card">No incoming orders right now.</div>}
          {orders.map((order) => <OrderRow key={order.order_number} order={order} actions={
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {order.status === "confirmed" || order.status === "placed" ? <><button className="btn-primary" onClick={() => updateShopStatus(order.order_number, "accepted")}>Accept</button><button className="btn-outline" onClick={() => updateShopStatus(order.order_number, "cancelled", "Unavailable from shop")}>Reject</button></> : null}
              {order.status === "accepted" && <button className="btn-primary" onClick={() => updateShopStatus(order.order_number, "packed")}>Mark packed</button>}
            </div>
          } />)}
          <h3>Products & Inventory</h3>
          {!products.length && <div className="ka-card">No products assigned to this shop yet.</div>}
          {products.map((product) => <div className="ka-card" key={product.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "8px", alignItems: "center" }}>
            <input className="input-field" value={product.name} onChange={(e) => setProducts((items) => items.map((item) => item.id === product.id ? { ...item, name: e.target.value } : item))} />
            <input className="input-field" type="number" value={product.price} onChange={(e) => setProducts((items) => items.map((item) => item.id === product.id ? { ...item, price: e.target.value } : item))} />
            <input className="input-field" value={product.category} onChange={(e) => setProducts((items) => items.map((item) => item.id === product.id ? { ...item, category: e.target.value } : item))} />
            <input className="input-field" type="number" value={product.stock_quantity} onChange={(e) => setProducts((items) => items.map((item) => item.id === product.id ? { ...item, stock_quantity: e.target.value } : item))} />
            <button className="btn-primary" onClick={() => saveProduct(product)}>Save</button>
          </div>)}
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div className="ka-card"><strong>{earnings?.completed_deliveries || 0}</strong><div>Completed deliveries</div></div>
            <div className="ka-card"><strong>{money(earnings?.total_earning)}</strong><div>Current earnings (₹20 each)</div></div>
          </div>
          <h3>Available for Pickup</h3>
          {!orders.some((order) => !order.rider_id) && <div className="ka-card">No orders are waiting for pickup.</div>}
          {orders.map((order) => <OrderRow key={order.order_number} order={order} actions={
            order.rider_id ? <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {order.status === "accepted" || order.status === "packed" ? <button className="btn-primary" onClick={() => riderStatus(order.order_number, "picked_up")}>Picked up</button> : null}
              {order.status === "picked_up" && <button className="btn-primary" onClick={() => riderStatus(order.order_number, "out_for_delivery")}>Out for delivery</button>}
              {order.status === "out_for_delivery" && <button className="btn-primary" onClick={() => riderStatus(order.order_number, "delivered")}>Delivered</button>}
            </div> : <button className="btn-primary" onClick={() => claim(order.order_number)}>Accept delivery</button>
          } />)}
          <h3>My Active Deliveries</h3>
          {!orders.some((order) => order.rider_id) && <div className="ka-card">You have no active deliveries.</div>}
          <button className="btn-outline" onClick={load}>Refresh deliveries</button>
        </>
      )}
    </div>
  );
}
