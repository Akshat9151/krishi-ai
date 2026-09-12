import React, { useState } from "react";
import { Sprout, Droplets, Thermometer, Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { coreApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CropRecommendation({ setCurrentView, setSelectedCropForCalc }) {
  const { preferences } = useAuth();

  const [location, setLocation] = useState(preferences?.farmLocation?.split(",")[0] || "Jaipur");
  const [soilType, setSoilType] = useState("alluvial");
  const [season, setSeason] = useState("rabi");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [nVal, setNVal] = useState("");
  const [pVal, setPVal] = useState("");
  const [kVal, setKVal] = useState("");
  const [phVal, setPhVal] = useState("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const soilOptions = [
    { value: "alluvial", label: "Alluvial Soil (जलोढ़ मिट्टी)" },
    { value: "black", label: "Black Soil (काली मिट्टी)" },
    { value: "red", label: "Red Soil (लाल मिट्टी)" },
    { value: "clay", label: "Clay Soil (चिकनी मिट्टी)" },
    { value: "sandy", label: "Sandy Soil (बलुई मिट्टी)" },
    { value: "loamy", label: "Loamy Soil (दोमट मिट्टी)" },
    { value: "laterite", label: "Laterite Soil (लेटराइट मिट्टी)" },
  ];

  const seasonOptions = [
    { value: "rabi", label: "Rabi / Winter (रबी)", desc: "Oct - Mar (Wheat, Mustard, Gram)" },
    { value: "kharif", label: "Kharif / Monsoon (खरीफ)", desc: "Jun - Oct (Rice, Maize, Cotton)" },
    { value: "zaid", label: "Zaid / Summer (जायद)", desc: "Mar - Jun (Vegetables, Pulses)" },
  ];

  const quickCities = ["Jaipur", "Ludhiana", "Bhopal", "Lucknow", "Indore", "Ahmedabad", "Patna"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError("Please enter your farm location/city.");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const data = await coreApi.predictCrop({
        location,
        soil_type: soilType,
        season,
        N: nVal,
        P: pVal,
        K: kVal,
        ph: phVal,
      });
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to predict crops. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title / Intro */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)" }}>
          Crop Recommendation (फसल चयन सलाह)
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Anticipate the best crops to plant based on your district's real-time climate, soil type, and current season.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="ka-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Your Farm Parameters</h3>

          {error && (
            <div style={{ padding: "10px 14px", background: "var(--terracotta-light)", color: "var(--terracotta)", borderRadius: "6px", fontSize: "13px" }}>
              {error}
            </div>
          )}

          {/* Location */}
          <div>
            <label className="input-label">Farm Location / District (ज़िला)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Jaipur, Ludhiana, Bhopal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
              {quickCities.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`chip ${location.toLowerCase() === c.toLowerCase() ? "active" : ""}`}
                  onClick={() => setLocation(c)}
                  style={{ fontSize: "11.5px", padding: "3px 10px" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Soil Type */}
          <div>
            <label className="input-label">Soil Type (मिट्टी का प्रकार)</label>
            <select
              className="input-field"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            >
              {soilOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="input-label">Sowing Season (बुवाई का मौसम)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {seasonOptions.map((s) => (
                <label
                  key={s.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: season === s.value ? "1.5px solid var(--marigold)" : "1px solid var(--card-border)",
                    backgroundColor: season === s.value ? "var(--marigold-light)" : "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="season"
                    value={s.value}
                    checked={season === s.value}
                    onChange={() => setSeason(s.value)}
                    style={{ accentColor: "var(--terracotta)" }}
                  />
                  <div>
                    <span style={{ fontWeight: "700", fontSize: "13.5px", color: "var(--text-primary)" }}>
                      {s.label}
                    </span>
                    <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Soil Nutrients Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span>Optional: Soil Health Card Details (N-P-K & pH)</span>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvanced && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px", padding: "12px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600" }}>Nitrogen (N)</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="e.g. 90"
                    value={nVal}
                    onChange={(e) => setNVal(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600" }}>Phosphorus (P)</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="e.g. 42"
                    value={pVal}
                    onChange={(e) => setPVal(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600" }}>Potassium (K)</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="e.g. 43"
                    value={kVal}
                    onChange={(e) => setKVal(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600" }}>Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    placeholder="e.g. 6.5"
                    value={phVal}
                    onChange={(e) => setPhVal(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            <Sparkles size={16} />
            <span>{loading ? "Analyzing Field Data..." : "Recommend Best Crops (फसल सुझाव पाएं)"}</span>
          </button>
        </form>

        {/* Results Presentation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            <div className="ka-card" style={{ textAlign: "center", padding: "40px" }}>
              <span style={{ fontSize: "36px" }}>🌱</span>
              <h4 style={{ fontSize: "16px", marginTop: "12px" }}>Analyzing soil & climate data...</h4>
              <div className="growing-bar" style={{ maxWidth: "200px", margin: "14px auto 0 auto" }}></div>
            </div>
          ) : results ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Weather conditions at prediction time */}
              <div
                className="ka-card"
                style={{
                  backgroundColor: "var(--marigold-light)",
                  borderColor: "var(--marigold)",
                  padding: "14px 18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#A36B18" }}>
                      LOCAL WEATHER FOR {results.location.toUpperCase()}
                    </span>
                    <p style={{ fontSize: "13.5px", color: "var(--text-primary)", margin: "2px 0 0 0" }}>
                      Temp: <strong>{results.temperature}°C</strong> | Humidity: <strong>{results.humidity}%</strong> | Rain: <strong>{results.rainfall} mm</strong>
                    </p>
                  </div>
                  <span className="badge-green">Optimal Conditions</span>
                </div>
              </div>

              {/* Recommended Crops Cards */}
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginTop: "4px" }}>
                Top Recommended Crops for Your Farm:
              </h3>

              {Array.isArray(results.recommended_crops) && results.recommended_crops.length > 0 ? (
                results.recommended_crops.map((item, idx) => {
                  const cropName = typeof item === "string" ? item : item.crop || item.name;
                  const description = item.description || "Thrives in current climate and soil profile.";
                  const tips = item.tips;
                  const water = item.water_requirement;
                  const fertilizer = item.recommended_fertilizer;
                  const icon = item.icon || "🌾";

                  return (
                    <div key={idx} className="ka-card" style={{ borderLeft: "4px solid var(--growth-green)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "32px" }}>{icon}</span>
                          <div>
                            <h4 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)" }}>
                              {cropName}
                            </h4>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                              {description}
                            </p>
                          </div>
                        </div>
                        <span className="badge-green">Rank #{idx + 1}</span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginTop: "14px", padding: "12px", backgroundColor: "var(--bg-cream)", borderRadius: "var(--radius-sm)" }}>
                        {water && (
                          <div style={{ fontSize: "12.5px" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Water Requirement:</span>
                            <p style={{ fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{water}</p>
                          </div>
                        )}
                        {fertilizer && (
                          <div style={{ fontSize: "12.5px" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Recommended Fertilizer:</span>
                            <p style={{ fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{fertilizer}</p>
                          </div>
                        )}
                      </div>

                      {tips && (
                        <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "10px" }}>
                          💡 <strong>Farming Tip:</strong> {tips}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: "12.5px", padding: "7px 12px" }}
                          onClick={() => {
                            if (setSelectedCropForCalc) setSelectedCropForCalc(cropName);
                            setCurrentView("fertilizer");
                          }}
                        >
                          <span>Calculate Fertilizer Dose</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="ka-card">
                  <p style={{ color: "var(--text-secondary)" }}>No specific crops returned. Try adjusting soil or season.</p>
                </div>
              )}
            </div>
          ) : (
            /* Empty state placeholder */
            <div className="ka-card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <span style={{ fontSize: "44px" }}>🌾</span>
              <h4 style={{ fontSize: "17px", fontWeight: "700", marginTop: "12px" }}>
                Ready to optimize your harvest
              </h4>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", maxWidth: "340px", margin: "8px auto 0 auto" }}>
                Fill in your farm location and soil type on the left, and our ML model will compute the most profitable crops for your acreage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
