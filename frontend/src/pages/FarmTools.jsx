import React, { useState } from "react";
import { Sprout, ScanSearch, CloudSun, TrendingUp, Calculator } from "lucide-react";
import CropRecommendation from "./CropRecommendation";
import DiseaseDetection from "./DiseaseDetection";
import WeatherInsights from "./WeatherInsights";
import MandiBhav from "./MandiBhav";
import FertilizerCalculator from "./FertilizerCalculator";

export default function FarmTools({ setCurrentView, defaultTool = "crop" }) {
  const [activeTab, setActiveTab] = useState(defaultTool);

  React.useEffect(() => {
    if (defaultTool) setActiveTab(defaultTool);
  }, [defaultTool]);

  const tabs = [
    { id: "crop", label: "Crop Advice", hindi: "फसल", icon: Sprout },
    { id: "disease", label: "Disease Scan", hindi: "रोग", icon: ScanSearch },
    { id: "weather", label: "Weather", hindi: "मौसम", icon: CloudSun },
    { id: "mandi", label: "Mandi Bhav", hindi: "मंडी", icon: TrendingUp },
    { id: "fertilizer", label: "Fertilizer", hindi: "खाद", icon: Calculator },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Horizontal Tabs for Mobile / Tools screen */}
      <div
        className="farm-tools-tabs"
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          padding: "10px 14px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid var(--card-border)",
          position: "sticky",
          top: "56px",
          zIndex: 25,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "var(--radius-full)",
                border: isActive ? "1.5px solid var(--terracotta)" : "1px solid var(--card-border)",
                backgroundColor: isActive ? "var(--terracotta-light)" : "#FFFFFF",
                color: isActive ? "var(--terracotta)" : "var(--text-secondary)",
                fontWeight: isActive ? "700" : "600",
                fontSize: "13px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 6px rgba(193, 68, 14, 0.12)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={16} color={isActive ? "var(--terracotta)" : "var(--text-secondary)"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div>
        {activeTab === "crop" && <CropRecommendation setCurrentView={setCurrentView} />}
        {activeTab === "disease" && <DiseaseDetection setCurrentView={setCurrentView} />}
        {activeTab === "weather" && <WeatherInsights />}
        {activeTab === "mandi" && <MandiBhav />}
        {activeTab === "fertilizer" && <FertilizerCalculator setCurrentView={setCurrentView} />}
      </div>
    </div>
  );
}
