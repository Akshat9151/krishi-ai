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
    title: "Refund Policy",
    sections: [
      ["Effective date and scope", "Effective 1 March 2026. This policy explains when KhetiTak can provide a refund, replacement or another resolution for products ordered through the KhetiTak agriculture marketplace."],
      ["Cash-on-delivery orders", "KhetiTak currently accepts cash on delivery for eligible orders. If a cash-on-delivery order is cancelled before dispatch, no payment has been collected and there is no payment refund."],
      ["Eligible issues", "Contact us if you receive an item that is wrong, damaged, materially different from the confirmed order or missing from the delivery. We may request photographs, the order number and details of the issue."],
      ["Exclusions", "A refund or replacement may not be available for normal wear, misuse, improper storage or handling, a change of mind after delivery, or an issue reported after the product has been used. Product-specific restrictions may apply where required for safety or law."],
      ["How to request a resolution", "Email support@khetitak.in with the subject “Refund Request”. Include your order number, registered phone number, issue description, photographs where relevant and whether you prefer a replacement or refund. Keep the product and original packaging available until review is complete."],
      ["Review, timelines and refund method", "We aim to acknowledge requests within 2 working days and normally communicate the outcome within 7 working days after receiving the information needed to review the case. For an approved prepaid order, the refund is sent to the original payment source where supported. For an approved COD or exceptional refund, we will contact you to confirm an appropriate method."],
      ["Business and support details", "KhetiTak, Bakshi Khad Beej Bhandar, Harsana, Laxmangarh, Alwar, Rajasthan, 321607. Email support@khetitak.in."],
    ],
  },
  "cancellation-policy": {
    title: "Cancellation Policy",
    sections: [
      ["Effective date and scope", "Effective 1 March 2026. This policy explains when an order placed through KhetiTak can be cancelled and what happens after cancellation."],
      ["Cancellation before dispatch", "You may request cancellation as soon as possible after placing an order. We can generally cancel an order while it is pending confirmation or before the local partner dealer dispatches it."],
      ["How to request cancellation", "Email support@khetitak.in with the subject “Order Cancellation”, your order number and the phone number used for the order. Wait for confirmation because a request is not complete until KhetiTak confirms the order status."],
      ["After dispatch", "Once an order has been dispatched or handed to a delivery partner, cancellation may not be possible. Do not refuse a delivery without contacting support, because the order may already be in transit."],
      ["Cancellation and refunds", "KhetiTak currently accepts cash on delivery. If a COD order is cancelled before dispatch, no payment has been collected and there is no payment refund. If an eligible prepaid order is cancelled before dispatch, the payment is refunded to the original payment source where supported, subject to provider timelines."],
      ["Dealer or availability cancellation", "A local partner dealer may be unable to fulfil an order because of stock, service-area or other operational constraints. If we cancel an eligible prepaid order for this reason, we will notify you and arrange the applicable refund."],
      ["Business and support details", "KhetiTak, Bakshi Khad Beej Bhandar, Harsana, Laxmangarh, Alwar, Rajasthan, 321607. Email support@khetitak.in."],
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
