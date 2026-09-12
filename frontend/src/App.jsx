import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";

import Dashboard from "./pages/Dashboard";
import CropRecommendation from "./pages/CropRecommendation";
import DiseaseDetection from "./pages/DiseaseDetection";
import AiAssistant from "./pages/AiAssistant";
import WeatherInsights from "./pages/WeatherInsights";
import MandiBhav from "./pages/MandiBhav";
import FertilizerCalculator from "./pages/FertilizerCalculator";
import AgriStore from "./pages/AgriStore";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import FarmTools from "./pages/FarmTools";
import Login from "./pages/Login";
import Register from "./pages/Register";

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedCropForCalc, setSelectedCropForCalc] = useState("wheat");

  // If on login/register view
  if (currentView === "login") {
    return (
      <Login
        onSwitchToRegister={() => setCurrentView("register")}
        onLoginSuccess={() => setCurrentView("dashboard")}
      />
    );
  }

  if (currentView === "register") {
    return (
      <Register
        onSwitchToLogin={() => setCurrentView("login")}
        onRegisterSuccess={() => setCurrentView("login")}
      />
    );
  }

  // Render Page Content
  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard setCurrentView={setCurrentView} />;
      case "crop":
        return (
          <CropRecommendation
            setCurrentView={setCurrentView}
            setSelectedCropForCalc={setSelectedCropForCalc}
          />
        );
      case "disease":
        return <DiseaseDetection setCurrentView={setCurrentView} />;
      case "assistant":
        return <AiAssistant />;
      case "weather":
        return <WeatherInsights />;
      case "mandi":
        return <MandiBhav />;
      case "fertilizer":
        return (
          <FertilizerCalculator
            defaultCrop={selectedCropForCalc}
            setCurrentView={setCurrentView}
          />
        );
      case "store":
        return <AgriStore setCurrentView={setCurrentView} />;
      case "orders":
        return <MyOrders setCurrentView={setCurrentView} />;
      case "profile":
        return <Profile setCurrentView={setCurrentView} />;
      case "tools":
        return (
          <FarmTools
            setCurrentView={setCurrentView}
            defaultTool={selectedCropForCalc ? "fertilizer" : "crop"}
          />
        );
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Fixed Left Sidebar (>=768px) */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main style={{ flex: 1 }}>{renderContent()}</main>
      </div>

      {/* Mobile Bottom Navigation (<768px) */}
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />

      {/* Cart Drawer */}
      <CartDrawer onNavigateOrders={() => setCurrentView("orders")} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
