import React from "react";
import { ArrowRight, CloudSun, Leaf, MessageCircle, Store, TrendingUp } from "lucide-react";
import { KhetiTakLogo } from "../components/KhetiTakBranding";
import Footer from "../components/Footer";

const pageContent = {
  home: {
    title: "Smart agriculture support for Indian farmers",
    intro: "KhetiTak brings crop planning, weather insights, mandi information, crop disease guidance and farm products together in one farmer-focused platform.",
  },
  about: {
    title: "About KhetiTak",
    intro: "KhetiTak is building practical digital tools that help farmers make better-informed decisions about crops, weather, markets and farm inputs.",
  },
  faq: {
    title: "KhetiTak Frequently Asked Questions",
    intro: "Find clear answers about KhetiTak's agriculture tools, data sources and account features.",
  },
};

const faqs = [
  ["What can I use KhetiTak for?", "KhetiTak provides crop planning tools, weather insights, mandi information, crop disease information, fertilizer calculations, an agriculture assistant and an agri-product catalog."],
  ["Is KhetiTak's advice a replacement for an agronomist?", "No. KhetiTak provides general decision support. For crop loss, pesticide use, soil treatment or other high-impact decisions, consult a qualified local agriculture expert."],
  ["Are mandi prices guaranteed live prices?", "Market prices can change by market, commodity, quality and arrival time. Always review the displayed source and update time before making a sale or purchase decision."],
  ["Do I need an account?", "Public information is available without an account. An account is required for personal dashboard features, saved farmer preferences, activities and orders."],
];

function navigate(setCurrentView, view) {
  setCurrentView(view);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function PublicSeoPage({ page = "home", setCurrentView }) {
  const content = pageContent[page] || pageContent.home;
  const isFaq = page === "faq";

  return (
    <main className="public-seo-page" style={{ minHeight: "100vh", background: "var(--bg-cream)", color: "var(--text-primary)" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "24px 20px 64px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <button type="button" onClick={() => navigate(setCurrentView, "home")} aria-label="Go to KhetiTak home" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}>
            <KhetiTakLogo size={38} />
          </button>
          <nav aria-label="Public navigation" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button type="button" className="btn-outline" onClick={() => navigate(setCurrentView, "about")}>About</button>
            <button type="button" className="btn-outline" onClick={() => navigate(setCurrentView, "faq")}>FAQ</button>
            <button type="button" className="btn-primary" onClick={() => navigate(setCurrentView, "login")}>Open farmer app <ArrowRight size={15} /></button>
          </nav>
        </header>

        <section style={{ padding: "72px 0 48px", maxWidth: "800px" }}>
          <span className="badge-marigold">KhetiTak Agriculture Platform</span>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.1, margin: "18px 0 16px" }}>{content.title}</h1>
          <p style={{ fontSize: "18px", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: "720px" }}>{content.intro}</p>
          {page === "home" && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "24px" }}>
              <button type="button" className="btn-primary" onClick={() => navigate(setCurrentView, "register")}>Create farmer account <ArrowRight size={16} /></button>
              <button type="button" className="btn-secondary" onClick={() => navigate(setCurrentView, "mandi")}>Explore mandi tools</button>
            </div>
          )}
        </section>

        {page === "home" && (
          <>
            <section aria-labelledby="tools-heading">
              <h2 id="tools-heading" style={{ fontSize: "26px", marginBottom: "16px" }}>Tools built for everyday farm decisions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                {[
                  [Leaf, "Crop planning", "Compare crop recommendations using farm and climate inputs."],
                  [TrendingUp, "Mandi information", "Review commodity and market information through the farmer app."],
                  [CloudSun, "Weather insights", "Use weather information to plan routine farm activities."],
                  [Store, "AgriStore", "Browse seeds, fertilizers and farm products in one catalog."],
                  [MessageCircle, "Agriculture assistant", "Ask practical farming questions and receive general guidance."],
                ].map(([Icon, title, description]) => (
                  <article key={title} className="ka-card">
                    <Icon size={22} color="var(--terracotta)" aria-hidden="true" />
                    <h3 style={{ fontSize: "17px", margin: "12px 0 6px" }}>{title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{description}</p>
                  </article>
                ))}
              </div>
            </section>
            <section aria-labelledby="trust-heading" style={{ marginTop: "42px", maxWidth: "800px" }}>
              <h2 id="trust-heading" style={{ fontSize: "26px", marginBottom: "12px" }}>Practical guidance, not promises</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Agriculture decisions depend on local soil, weather, crop variety, market conditions and expert advice.
                KhetiTak is designed as a decision-support platform and does not replace a qualified agronomist or official advisory.
              </p>
            </section>
          </>
        )}

        {page === "about" && (
          <section aria-labelledby="mission-heading" style={{ maxWidth: "800px" }}>
            <h2 id="mission-heading" style={{ fontSize: "26px", marginBottom: "12px" }}>Our focus</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
              We are bringing useful agriculture workflows into a simpler digital experience for Indian farmers.
              The product connects farmer preferences with crop tools, weather information, market information and agri-commerce.
              Data freshness and source context should always be considered before making a high-impact farm decision.
            </p>
          </section>
        )}

        {isFaq && (
          <section aria-labelledby="faq-heading" style={{ maxWidth: "800px" }}>
            <h2 id="faq-heading" style={{ fontSize: "26px", marginBottom: "16px" }}>Questions farmers ask</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {faqs.map(([question, answer]) => (
                <details key={question} className="ka-card">
                  <summary style={{ cursor: "pointer", fontWeight: "700" }}>{question}</summary>
                  <p style={{ color: "var(--text-secondary)", marginTop: "10px", lineHeight: 1.7 }}>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

      </div>
      <Footer setCurrentView={setCurrentView} />
      {isFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }) }} />
      )}
    </main>
  );
}
