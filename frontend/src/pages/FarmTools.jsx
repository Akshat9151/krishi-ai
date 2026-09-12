import React, { useState } from "react";
import { Sprout, ScanSearch, CloudSun, TrendingUp, Calculator } from "lucide-react";
import CropRecommendation from "./CropRecommendation";
import DiseaseDetection from "./DiseaseDetection";
import WeatherInsights from "./WeatherInsights";
import MandiBhav from "./MandiBhav";
import FertilizerCalculator from "./FertilizerCalculator";

export default function FarmTools({ setCurrentView, defaultTool = "crop" }) {
  const [activeTab, setActiveTab] = useState(defaultTool);

  const tabs = [
    { id: "crop", label: "Crop Advice", hindi: "फसल", icon: Sprout },
    { id: "disease", label: "Disease Scan", hindi: "रोग", icon: ScanSearch },
    { id: "weather", label: "Weather", hindi: "मौसम", icon: CloudSun },
    { id: "mandi", label: "Mandi Bhav", hindi: "मंडी", icon: TrendingUp },
    { id: "fertilizer", label: "Fertilizer", hindi: "खाद", icon: Calculator },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Horizontal Tabs for Mobile / Tools screen */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          padding: "10px 16px 4px 16px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid var(--card-border)",
          position: "sticky",
          top: "60px",
          zIndex: 20,
          scrollbarWidth: "none",
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
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "var(--radius-full)",
                border: isActive ? "1.5px solid var(--terracotta)" : "1px solid var(--card-border)",
                backgroundColor: isActive ? "var(--terracotta-light)" : "var(--bg-cream)",
                color: isActive ? "var(--terracotta)" : "var(--text-secondary)",
                fontWeight: isActive ? "700" : "500",
                fontSize: "12.5px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} color={isActive ? "var(--terracotta)" : "var(--text-secondary)"} />
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
