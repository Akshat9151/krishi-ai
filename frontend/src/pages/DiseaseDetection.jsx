import React, { useState } from "react";
import { ScanSearch, AlertTriangle, ShieldCheck, ShoppingCart, Check, Sparkles } from "lucide-react";
import { coreApi, storeApi } from "../services/api";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../context/LanguageContext";

export default function DiseaseDetection({ setCurrentView }) {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [addedProductId, setAddedProductId] = useState(null);

  const popularCrops = [
    { id: "wheat", name: "Wheat (गेहूं)", icon: "🌾", defaultSymptom: "Yellow rust, powdery spots on leaves" },
    { id: "rice", name: "Rice (धान)", icon: "🌾", defaultSymptom: "Diamond-shaped lesions, blast spots" },
    { id: "cotton", name: "Cotton (कपास)", icon: "🌱", defaultSymptom: "Leaf curl, whitefly damage, wilting" },
    { id: "maize", name: "Maize (मक्का)", icon: "🌽", defaultSymptom: "Brown blight spots, stalk rot" },
    { id: "potato", name: "Potato (आलू)", icon: "🥔", defaultSymptom: "Late blight, blackening leaf edges" },
    { id: "tomato", name: "Tomato (टमाटर)", icon: "🍅", defaultSymptom: "Leaf curl virus, early blight" },
    { id: "mustard", name: "Mustard (सरसों)", icon: "🌼", defaultSymptom: "White rust, aphid attack" },
  ];

  const handleDiagnose = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDiagnosis(null);
    setProducts([]);

    try {
      // 1. Predict disease
      const diseaseData = await coreApi.predictDisease(selectedCrop);
      setDiagnosis(diseaseData);

      // 2. Recommend products
      try {
        const prodData = await coreApi.recommendProducts(selectedCrop);
        if (prodData && prodData.products) {
          // Enrich with real store data (price, image) by searching each product slug
          const enriched = await Promise.all(
            prodData.products.map(async (prod) => {
              try {
                const results = await storeApi.search(prod.slug || prod.name);
                const storeProduct = Array.isArray(results)
                  ? results[0]
                  : results?.products?.[0] || results?.items?.[0];
                if (storeProduct) {
                  return { ...prod, price: storeProduct.price, image_url: storeProduct.image_url, id: storeProduct.id };
                }
              } catch { /* ignore enrichment failure */ }
              return prod;
            })
          );
          setProducts(enriched);
        }
      } catch (pErr) {
        console.warn("Products recommendation fallback:", pErr);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze crop health. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id || Math.floor(Math.random() * 1000) + 100,
      name: product.name,
      price: product.price || 450,
      image_url: product.image_url || "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=120",
      unit: "500ml / 1kg",
      brand: "Krishi AI Certified",
    };
    addToCart(cartProduct, 1);
    setAddedProductId(product.name);
    setTimeout(() => setAddedProductId(null), 2500);
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)" }}>
          {t("diseaseTitle", "Plant Disease Diagnosis & Remedy")}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          {t("diseaseSubtitle", "Select your affected crop and symptoms to get immediate expert diagnosis, curative steps, and verified remedies.")}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
        {/* Diagnosis Form */}
        <form onSubmit={handleDiagnose} className="ka-card" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Select Affected Crop</h3>

          {error && (
            <div style={{ padding: "10px 14px", background: "var(--terracotta-light)", color: "var(--terracotta)", borderRadius: "6px", fontSize: "13px" }}>
              {error}
            </div>
          )}

          {/* Crop Selector Chips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
            {popularCrops.map((crop) => (
              <button
                type="button"
                key={crop.id}
                onClick={() => {
                  setSelectedCrop(crop.id);
                  setSymptomsInput(crop.defaultSymptom);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: selectedCrop === crop.id ? "1.5px solid var(--terracotta)" : "1px solid var(--card-border)",
                  backgroundColor: selectedCrop === crop.id ? "var(--terracotta-light)" : "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "18px" }}>{crop.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: selectedCrop === crop.id ? "700" : "500", color: "var(--text-primary)" }}>
                  {crop.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Observed Symptoms */}
          <div>
            <label className="input-label">Describe Observed Symptoms (लक्षण)</label>
            <textarea
              rows={3}
              className="input-field"
              placeholder="e.g. Yellowing spots on leaves, stunted plant height, white powder"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            <ScanSearch size={17} />
            <span>{loading ? "Diagnosing Symptoms..." : t("diagnoseBtn", "Diagnose Crop Disease")}</span>
          </button>
        </form>

        {/* Diagnosis & Products Output */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            <div className="ka-card" style={{ textAlign: "center", padding: "40px" }}>
              <span style={{ fontSize: "36px" }}>🔬</span>
              <h4 style={{ fontSize: "16px", marginTop: "12px" }}>Analyzing pathology patterns...</h4>
              <div className="growing-bar" style={{ maxWidth: "200px", margin: "14px auto 0 auto" }}></div>
            </div>
          ) : diagnosis ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Diagnosis Card */}
              <div
                className="ka-card"
                style={{
                  borderLeft: "5px solid var(--terracotta)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <span className="badge-terracotta">Diagnosis Identified</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginTop: "6px" }}>
                      {diagnosis.disease}
                    </h3>
                  </div>
                  <AlertTriangle size={24} color="var(--terracotta)" />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "14px" }}>
                  <div style={{ padding: "12px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--text-secondary)" }}>
                      PRIMARY SYMPTOMS:
                    </span>
                    <p style={{ fontSize: "13.5px", color: "var(--text-primary)", margin: "4px 0 0 0" }}>
                      {diagnosis.symptoms}
                    </p>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "var(--growth-green-light)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--growth-green)", marginBottom: "4px" }}>
                      <ShieldCheck size={16} />
                      <span style={{ fontSize: "12.5px", fontWeight: "700" }}>ACTIONABLE REMEDY & EXPERT ADVICE:</span>
                    </div>
                    <p style={{ fontSize: "13.5px", color: "var(--text-primary)", margin: 0, lineHeight: "1.5" }}>
                      {diagnosis.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Store Products */}
              {products.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "10px" }}>
                    Verified Treatments in AgriStore:
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {products.map((prod, idx) => (
                      <div
                        key={idx}
                        className="ka-card"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          padding: "14px",
                        }}
                      >
                        <div>
                          <h5 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                            {prod.name}
                          </h5>
                          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {prod.price ? `₹${prod.price}` : "Price on store"} • Fast Village Delivery Available
                          </p>
                        </div>
                        <button
                          className="btn-primary"
                          style={{ fontSize: "12.5px", padding: "7px 12px" }}
                          onClick={() => handleAddToCart(prod)}
                        >
                          {addedProductId === prod.name ? (
                            <>
                              <Check size={14} />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} />
                              <span>{t("addToCart", "Add to Cart")}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="ka-card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <span style={{ fontSize: "44px" }}>🔍</span>
              <h4 style={{ fontSize: "17px", fontWeight: "700", marginTop: "12px" }}>
                Protect your crops from pests and disease
              </h4>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", maxWidth: "340px", margin: "8px auto 0 auto" }}>
                Select a crop above to review symptoms, obtain certified treatment plans, and order effective bio-care sprays directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
