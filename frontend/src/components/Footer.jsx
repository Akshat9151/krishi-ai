import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { KhetiTakLogo } from "./KhetiTakBranding";

const quickLinks = [
  ["dashboard", "Dashboard"],
  ["crop", "Crop Recommendation"],
  ["store", "AgriStore"],
  ["mandi", "Mandi Bhav"],
  ["about", "About Us"],
];

const legalLinks = [
  ["terms", "Terms & Conditions"],
  ["privacy", "Privacy Policy"],
  ["refund-policy", "Refund & Cancellation Policy"],
  ["shipping-policy", "Shipping & Delivery Policy"],
];

export default function Footer({ setCurrentView }) {
  const navigate = (view) => {
    if (setCurrentView) {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = `/${view}`;
    }
  };

  return (
    <footer style={{ background: "var(--card-surface)", borderTop: "1px solid var(--card-border)", marginTop: "48px", padding: "36px 24px 18px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div className="khetitak-footer-grid" style={{ display: "grid", gap: "28px" }}>
          <div>
            <KhetiTakLogo size={38} />
            <p style={{ marginTop: "12px", fontWeight: "600" }}>खेती का भरोसा, आपके पास</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "6px", maxWidth: "260px" }}>
              Smart farming advisory aur agri-input delivery, aapke gaon tak.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "15px", marginBottom: "10px" }}>Quick Links</h3>
            {quickLinks.map(([view, label]) => (
              <button key={view} type="button" onClick={() => navigate(view)} style={linkStyle}>{label}</button>
            ))}
            <a href="mailto:support@khetitak.in" style={linkStyle}>Contact</a>
          </div>
          <div>
            <h3 style={{ fontSize: "15px", marginBottom: "10px" }}>Legal</h3>
            {legalLinks.map(([view, label]) => (
              <button key={view} type="button" onClick={() => navigate(view)} style={linkStyle}>{label}</button>
            ))}
          </div>
          <div>
            <h3 style={{ fontSize: "15px", marginBottom: "10px" }}>Partner Login</h3>
            <a href="#shop-login" style={linkStyle}>Shop/Agency Login</a>
            <a href="#rider-login" style={linkStyle}>Delivery Partner Login</a>
          </div>
          <div>
            <h3 style={{ fontSize: "15px", marginBottom: "10px" }}>Contact</h3>
            <p style={contactStyle}><MapPin size={15} /> Bakshi Khad Beej Bhandar, Harsana, Laxmangarh, Alwar, Rajasthan, 321607</p>
            <a href="mailto:support@khetitak.in" style={contactStyle}><Mail size={15} /> support@khetitak.in</a>
            <p style={contactStyle}><Phone size={15} /> Phone number to be updated</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--card-border)", marginTop: "28px", paddingTop: "14px", color: "var(--text-muted)", fontSize: "12px", textAlign: "center" }}>
          © 2026 KhetiTak. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const linkStyle = {
  display: "block",
  border: 0,
  background: "transparent",
  color: "var(--text-secondary)",
  cursor: "pointer",
  font: "inherit",
  fontSize: "13px",
  padding: "4px 0",
  textAlign: "left",
  textDecoration: "none",
};

const contactStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "7px",
  color: "var(--text-secondary)",
  fontSize: "12.5px",
  lineHeight: 1.5,
  marginBottom: "9px",
  textDecoration: "none",
};
