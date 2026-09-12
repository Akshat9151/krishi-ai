import React, { useState, useEffect } from "react";
import { Calculator, ShoppingCart, Check, Info, ArrowRight, Sparkles } from "lucide-react";
import { storeApi } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function FertilizerCalculator({ defaultCrop, setCurrentView }) {
  const { preferences } = useAuth();
  const { addToCart } = useCart();

  const [landArea, setLandArea] = useState(preferences?.landSize || "2");
  const [landUnit, setLandUnit] = useState(preferences?.landUnit || "Acres");
  const [crop, setCrop] = useState(defaultCrop ? defaultCrop.toLowerCase() : "wheat");
  const [soilHealth, setSoilHealth] = useState("medium");

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  const cropDosageProfiles = {
    wheat: { name: "Wheat (गेहूं)", ureaPerAcre: 55, dapPerAcre: 50, mopPerAcre: 20, basalNote: "Apply full DAP + 1/3 Urea at sowing. Top dress remaining Urea in 2 splits after first and second irrigation." },
    rice: { name: "Rice / Paddy (धान)", ureaPerAcre: 65, dapPerAcre: 45, mopPerAcre: 25, basalNote: "Apply full DAP and MOP at puddling/transplanting. Split Urea across vegetative and panicle initiation stages." },
    maize: { name: "Maize (मक्का)", ureaPerAcre: 70, dapPerAcre: 50, mopPerAcre: 30, basalNote: "Side-dress Nitrogen 25-30 days after germination for robust cob development." },
    cotton: { name: "Cotton (कपास)", ureaPerAcre: 60, dapPerAcre: 40, mopPerAcre: 35, basalNote: "Split Nitrogen across square formation and early flowering stages." },
    mustard: { name: "Mustard (सरसों)", ureaPerAcre: 45, dapPerAcre: 40, mopPerAcre: 15, basalNote: "Apply 20kg Sulfur along with basal DAP for increased oil content." },
    potato: { name: "Potato (आलू)", ureaPerAcre: 80, dapPerAcre: 75, mopPerAcre: 60, basalNote: "High potassium and phosphorus demand for tuber sizing." },
    sugarcane: { name: "Sugarcane (गन्ना)", ureaPerAcre: 110, dapPerAcre: 60, mopPerAcre: 50, basalNote: "Heavy nitrogen feeder. Apply in multiple splits throughout tillering." },
    soybean: { name: "Soybean (सोयाबीन)", ureaPerAcre: 20, dapPerAcre: 50, mopPerAcre: 20, basalNote: "Legume crop fixes atmospheric nitrogen. Higher phosphorus required." },
  };

  // Convert area into standard acres
  const getAcres = () => {
    const area = parseFloat(landArea) || 0;
    if (landUnit === "Bigha") return area * 0.4;
    if (landUnit === "Hectares") return area * 2.471;
    return area; // Acres
  };

  const currentAcres = getAcres();
  const selectedProfile = cropDosageProfiles[crop] || cropDosageProfiles.wheat;

  // Compute exact quantities
  const ureaKg = Math.round(selectedProfile.ureaPerAcre * currentAcres);
  const ureaBags = (ureaKg / 45).toFixed(1); // 45kg standard bags

  const dapKg = Math.round(selectedProfile.dapPerAcre * currentAcres);
  const dapBags = (dapKg / 50).toFixed(1); // 50kg standard bags

  const mopKg = Math.round(selectedProfile.mopPerAcre * currentAcres);
  const mopBags = (mopKg / 50).toFixed(1); // 50kg standard bags

  // Fetch verified fertilizer recommendations from backend
  useEffect(() => {
    const fetchRecs = async () => {
      setLoadingRecs(true);
      try {
        const recs = await storeApi.getFertilizerRecommendations({ crop });
        if (recs && Array.isArray(recs)) {
          setRecommendedProducts(recs);
        }
      } catch (err) {
        console.warn("Fertilizer recommendations error:", err);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, [crop]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 2500);
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)" }}>
          Fertilizer Dose Calculator (खाद की सटीक गणना)
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Input your crop and land acreage to calculate scientific N-P-K nutrient needs and order matching fertilizers directly.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
        {/* Input Card */}
        <div className="ka-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Farm Land & Crop Details</h3>

          {/* Land Area and Unit */}
          <div>
            <label className="input-label">Farm Land Area (खेत का आकार)</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                min="0.1"
                step="0.5"
                className="input-field"
                placeholder="e.g. 2.5"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                style={{ flex: 1 }}
              />
              <select
                className="input-field"
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                style={{ width: "130px" }}
              >
                <option value="Acres">Acres (एकड़)</option>
                <option value="Bigha">Bigha (बीघा)</option>
                <option value="Hectares">Hectares (हेक्टेयर)</option>
              </select>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
              Calculated Equivalent: <strong>{currentAcres.toFixed(2)} standard acres</strong>
            </p>
          </div>

          {/* Crop Selector */}
          <div>
            <label className="input-label">Target Crop (फसल)</label>
            <select
              className="input-field"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              {Object.keys(cropDosageProfiles).map((k) => (
                <option key={k} value={k}>
                  {cropDosageProfiles[k].name}
                </option>
              ))}
            </select>
          </div>

          {/* Soil Status */}
          <div>
            <label className="input-label">Soil Nutrient Level (मिट्टी का स्वास्थ्य)</label>
            <select
              className="input-field"
              value={soilHealth}
              onChange={(e) => setSoilHealth(e.target.value)}
            >
              <option value="medium">Medium / Normal (सामान्य स्तर)</option>
              <option value="low">Low Organic Matter (कम उपजाऊ - +15% Dose)</option>
              <option value="high">High Fertility (उपजाऊ - -10% Dose)</option>
            </select>
          </div>

          {/* Schedule note */}
          <div style={{ padding: "12px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--terracotta)", fontWeight: "700", fontSize: "12.5px" }}>
              <Info size={16} />
              <span>Recommended Application Timing:</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: "1.4" }}>
              {selectedProfile.basalNote}
            </p>
          </div>
        </div>

        {/* Output Doses */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="ka-card" style={{ borderLeft: "5px solid var(--marigold)" }}>
            <span className="badge-marigold">RECOMMENDED DOSAGE</span>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginTop: "6px" }}>
              Nutrient Plan for {landArea} {landUnit} of {selectedProfile.name.split(" ")[0]}
            </h3>

            {/* 3 Fertilizer Dose Badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginTop: "16px" }}>
              {/* Urea */}
              <div style={{ padding: "14px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  UREA (46% N)
                </span>
                <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "4px 0 0 0" }}>
                  {ureaKg} <span style={{ fontSize: "14px", fontWeight: "500" }}>kg</span>
                </p>
                <p style={{ fontSize: "12px", color: "var(--terracotta)", fontWeight: "600", margin: 0 }}>
                  ~ {ureaBags} Bags (45kg)
                </p>
              </div>

              {/* DAP */}
              <div style={{ padding: "14px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  DAP (18:46:0)
                </span>
                <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "4px 0 0 0" }}>
                  {dapKg} <span style={{ fontSize: "14px", fontWeight: "500" }}>kg</span>
                </p>
                <p style={{ fontSize: "12px", color: "var(--growth-green)", fontWeight: "600", margin: 0 }}>
                  ~ {dapBags} Bags (50kg)
                </p>
              </div>

              {/* MOP Potash */}
              <div style={{ padding: "14px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  MOP (Potash 60%)
                </span>
                <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "4px 0 0 0" }}>
                  {mopKg} <span style={{ fontSize: "14px", fontWeight: "500" }}>kg</span>
                </p>
                <p style={{ fontSize: "12px", color: "var(--marigold-hover)", fontWeight: "600", margin: 0 }}>
                  ~ {mopBags} Bags (50kg)
                </p>
              </div>
            </div>
          </div>

          {/* Matching Products from AgriStore */}
          <div className="ka-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>
                Matched Fertilizers in AgriStore:
              </h4>
              <button
                onClick={() => setCurrentView("store")}
                style={{ background: "transparent", border: "none", color: "var(--terracotta)", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span>Browse Store</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {loadingRecs ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Loading verified fertilizers...</p>
            ) : recommendedProducts.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recommendedProducts.slice(0, 3).map((rec, idx) => {
                  const prod = rec.product || rec;
                  return (
                    <div
                      key={prod.id || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        backgroundColor: "var(--bg-cream)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={prod.image_url || "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=100"}
                          alt={prod.name}
                          style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }}
                        />
                        <div>
                          <p style={{ fontSize: "13.5px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                            {prod.name}
                          </p>
                          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                            ₹{prod.price} • {prod.brand || "IFFCO / KRIBHCO"}
                          </p>
                        </div>
                      </div>

                      <button
                        className="btn-primary"
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                        onClick={() => handleAddToCart(prod)}
                      >
                        {addedProduct === prod.id ? (
                          <>
                            <Check size={13} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={13} />
                            <span>Buy</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                High-grade granular Urea, DAP, and NPK fertilizers are available in the AgriStore with Village Cash-on-Delivery.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
