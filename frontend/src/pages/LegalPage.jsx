import React from "react";
import { ArrowLeft } from "lucide-react";
import { KhetiTakLogo } from "../components/KhetiTakBranding";
import Footer from "../components/Footer";

const content = {
  terms: {
    title: "Terms & Conditions",
    sections: [
      ["About KhetiTak", "KhetiTak is an agriculture advisory and marketplace application that connects farmers with practical farming tools and local agri-input dealers. We facilitate access to information and products; we do not operate as a manufacturer or agricultural authority."],
      ["Accounts and responsibilities", "You are responsible for providing accurate account and delivery information, keeping your login details confidential, and using the platform lawfully. Please inform us if you believe your account has been accessed without permission."],
      ["Orders and cash on delivery", "Orders are currently fulfilled on a cash-on-delivery basis. By placing an order, you confirm that the details are correct and agree to accept the order and pay the displayed amount at delivery. An order is subject to product availability and confirmation by the local partner dealer."],
      ["Products and local dealers", "Product listings, availability, packaging and fulfilment are provided by local partner dealers. KhetiTak facilitates the connection and displays information supplied by those dealers. We aim for accuracy, but packaging, stock and availability can change."],
      ["Advisory limitation", "Crop, weather, disease and fertilizer information is general decision support, not a guarantee of yield, crop health or income. Local soil, weather, variety, farming practice and expert advice should be considered before making high-impact decisions."],
      ["Governing law", "These terms are governed by the laws of India. Courts having jurisdiction in Rajasthan will have jurisdiction, subject to applicable consumer protection law."],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["Information we collect", "We may collect your name or username, phone number, email address, farm location, saved farm preferences and order history. We also receive information needed to authenticate your account and fulfil deliveries."],
      ["Why we use it", "We use this information to provide recommendations, maintain your profile, process and support orders, communicate about account or delivery matters, improve reliability and protect the platform from misuse."],
      ["Sharing and sale of data", "We do not sell your personal information. Delivery details may be shared with the local partner dealer responsible for fulfilling your order, and information may be disclosed when required by law or necessary to protect users and the platform."],
      ["OTP and Google Sign-In", "OTP codes are used to verify signup, login or password recovery and are not stored as plain text. Google Sign-In provides an identity credential; we use the account information needed to create or access your KhetiTak account. Never share an OTP with anyone."],
      ["Your choices and security", "You may request corrections to your profile information or ask questions about its use. We use reasonable safeguards, but no internet service can guarantee absolute security."],
      ["Privacy contact", "For privacy questions or requests, email support@khetitak.in with the subject “Privacy Request”."],
    ],
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    sections: [
      ["Cash-on-delivery orders", "KhetiTak currently accepts cash on delivery, so no online payment refund is normally involved. If you cancel before dispatch, there is no payment to refund."],
      ["Cancellation", "Request cancellation as soon as possible through the support contact. We can generally cancel an order before it is dispatched; once dispatched, cancellation may not be possible."],
      ["Wrong or damaged items", "If an item is wrong, damaged or materially different from the confirmed order, contact us promptly with the order number and clear photographs. We will coordinate with the partner dealer for replacement, return or another fair resolution."],
      ["Timeline and resolution", "We aim to acknowledge a complaint within 2 working days and coordinate a resolution within a reasonable period depending on dealer pickup and product verification. For COD orders, an approved refund will be arranged through a mutually agreed method."],
      ["Support", "Contact support@khetitak.in with your order number, issue details and preferred resolution. Keep the item and packaging available until the case is reviewed."],
    ],
  },
  "shipping-policy": {
    title: "Shipping & Delivery Policy",
    sections: [
      ["Who fulfils delivery", "Orders are fulfilled by local partner agri-input dealer shops connected through KhetiTak. Delivery availability depends on the dealer serving your address and the product being in stock."],
      ["Delivery areas and timelines", "Delivery is currently limited to areas served by our partner dealers. Delivery timing varies by distance, dealer workload, weather, stock and local conditions; the dealer will provide the best available estimate after order confirmation. We do not promise a fixed fast-delivery time."],
      ["Delivery updates", "Please provide an accurate phone number and address. The dealer or KhetiTak may contact you to confirm directions, availability or a suitable delivery time."],
      ["Delayed delivery", "If delivery is delayed, contact support@khetitak.in with your order number. We will check with the partner dealer and share an updated estimate or discuss cancellation where fulfilment is no longer practical."],
      ["Inspection at delivery", "Please check the package and product against your order at delivery. Report a wrong or visibly damaged item promptly so that the return or replacement process can begin."],
    ],
  },
};

export default function LegalPage({ page = "terms", setCurrentView }) {
  const data = content[page] || content.terms;
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-cream)" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "24px 20px 40px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <button type="button" onClick={() => setCurrentView("home")} aria-label="Go to KhetiTak home" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}>
            <KhetiTakLogo size={38} />
          </button>
          <button type="button" className="btn-outline" onClick={() => setCurrentView("home")}><ArrowLeft size={15} /> Back to home</button>
        </header>
        <main style={{ maxWidth: "820px", margin: "56px auto 0" }}>
          <span className="badge-marigold">KhetiTak Policies</span>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", margin: "16px 0 28px" }}>{data.title}</h1>
          <div style={{ display: "grid", gap: "18px" }}>
            {data.sections.map(([heading, text]) => (
              <section key={heading} className="ka-card">
                <h2 style={{ fontSize: "19px", marginBottom: "8px" }}>{heading}</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{text}</p>
              </section>
            ))}
          </div>
        </main>
      </div>
      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}
