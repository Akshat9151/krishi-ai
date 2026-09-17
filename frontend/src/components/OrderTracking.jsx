import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, PackageCheck, Store, Truck } from "lucide-react";

const TRACKING_STAGES = [
  { key: "placed", label: "Order Placed", icon: PackageCheck },
  { key: "accepted", label: "Accepted by Shop", icon: Store },
  { key: "picked_up", label: "Rider Assigned", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function stageFromOrder(order) {
  const status = String(order?.status || "placed").toLowerCase();
  if (status === "delivered") return 4;
  if (status === "out_for_delivery") return 3;
  if (status === "picked_up" || status === "rider_assigned") return 2;
  if (status === "accepted" || status === "confirmed") return 1;
  return 0;
}

export default function OrderTracking({ order, onBack }) {
  const [activeStage, setActiveStage] = useState(stageFromOrder(order));

  useEffect(() => {
    setActiveStage(stageFromOrder(order));
  }, [order]);

  const currentStage = TRACKING_STAGES[activeStage];
  const CurrentIcon = currentStage.icon;

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <button className="btn-outline" onClick={onBack} style={{ alignSelf: "flex-start" }}>
        <ArrowLeft size={16} />
        <span>Back to My Orders</span>
      </button>

      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "800" }}>Track Order #{order.order_number}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Expected delivery: today or tomorrow, depending on local route availability.
        </p>
      </div>

      <div className="ka-card" style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "5px solid var(--terracotta)" }}>
        <CurrentIcon size={26} color="var(--terracotta)" />
        <div>
          <strong style={{ fontSize: "16px" }}>{currentStage.label}</strong>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "2px" }}>
            Demo tracking updates automatically every 12 seconds.
          </p>
        </div>
      </div>

      <div className="ka-card">
        <h3 style={{ fontSize: "16px", marginBottom: "18px" }}>Delivery progress</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {TRACKING_STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const complete = index <= activeStage;
            return (
              <div key={stage.key} style={{ display: "flex", gap: "12px", minHeight: index === TRACKING_STAGES.length - 1 ? "42px" : "58px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: complete ? "var(--terracotta-light)" : "var(--bg-cream)", border: `1px solid ${complete ? "var(--terracotta)" : "var(--card-border)"}`, color: complete ? "var(--terracotta)" : "var(--text-muted)" }}>
                    <Icon size={16} />
                  </div>
                  {index < TRACKING_STAGES.length - 1 && <div style={{ width: "2px", flex: 1, background: index < activeStage ? "var(--terracotta)" : "var(--card-border)" }} />}
                </div>
                <div style={{ paddingTop: "5px" }}>
                  <strong style={{ fontSize: "14px", color: complete ? "var(--text-primary)" : "var(--text-muted)" }}>{stage.label}</strong>
                  {index === activeStage && <p style={{ color: "var(--terracotta)", fontSize: "12px", marginTop: "2px" }}>Current status</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ka-card">
        <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Delivery route</h3>
        <div style={{ position: "relative", minHeight: "180px", overflow: "hidden", borderRadius: "var(--radius-sm)", background: "var(--bg-cream)", border: "1px solid var(--card-border)" }}>
          <div style={{ position: "absolute", inset: "18px", background: "linear-gradient(135deg, transparent 49%, var(--card-border) 50%, transparent 51%), linear-gradient(45deg, transparent 49%, var(--card-border) 50%, transparent 51%)", backgroundSize: "44px 44px", opacity: 0.8 }} />
          <div style={{ position: "absolute", left: "18%", top: "60%", width: "64%", height: "2px", background: "var(--terracotta)", transform: "rotate(-20deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", left: "12%", top: "57%", display: "flex", alignItems: "center", gap: "5px", color: "var(--terracotta)", fontSize: "12px", fontWeight: "700" }}><Store size={17} /> Local shop</div>
          <div style={{ position: "absolute", right: "8%", top: "18%", display: "flex", alignItems: "center", gap: "5px", color: "var(--growth-green)", fontSize: "12px", fontWeight: "700" }}><MapPin size={17} /> Farmer location</div>
          <div style={{ position: "absolute", left: "48%", top: "43%", color: "var(--marigold)" }}><Truck size={22} /></div>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "10px" }}>
          Illustrative route only. Live rider location and GPS movement are not connected yet.
        </p>
      </div>

      <div className="ka-card" style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Delivering to {order.customer_name || "your farm"}</span>
        <strong style={{ color: "var(--terracotta)" }}>₹{order.total_amount}</strong>
      </div>
    </div>
  );
}
