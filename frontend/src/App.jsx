import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

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
import PartnerAuth from "./pages/PartnerAuth";
import ShopDashboard from "./pages/ShopDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import { KhetiTakSplash } from "./components/KhetiTakBranding";

function MainApp() {
  const { user } = useAuth();

  const getInitialView = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace("#", "");

      if (path === "/splash" || hash === "splash") return "splash";
      if (path === "/login" || hash === "login") return "login";
      if (path === "/register" || hash === "register") return "register";
      if (hash === "shop-login" || hash === "rider-login") return hash;
      if (hash === "shop-dashboard" || hash === "rider-dashboard") return hash;
      if (hash && ["splash", "dashboard", "crop", "disease", "assistant", "weather", "mandi", "fertilizer", "store", "orders", "profile", "tools", "shop-login", "rider-login", "shop-dashboard", "rider-dashboard"].includes(hash)) {
        return hash;
      }

      // Check if user has seen splash
      const seenSplash = sessionStorage.getItem("khetitak_seen_splash");
      if (!seenSplash && !localStorage.getItem("accessToken")) {
        sessionStorage.setItem("khetitak_seen_splash", "true");
        return "splash";
      }

      // If user is not authenticated and has no active token, land on Login/Signup
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return "login";
      }
    }
    return "dashboard";
  };

  const [currentView, setCurrentViewState] = useState(getInitialView);
  const [selectedCropForCalc, setSelectedCropForCalc] = useState("wheat");
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));

  const setCurrentView = (view) => {
    setCurrentViewState(view);
    if (typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", `#${view}`);
      } catch {
        window.location.hash = view;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace("#", "");
      if (hash && ["login", "register", "shop-login", "rider-login", "shop-dashboard", "rider-dashboard", "dashboard", "crop", "disease", "assistant", "weather", "mandi", "fertilizer", "store", "orders", "profile", "tools"].includes(hash)) {
        setCurrentViewState(hash);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Auto-navigate splash screen after 1.8s matching native cold-start feel
  useEffect(() => {
    if (currentView === "splash") {
      const timer = setTimeout(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("userRole");
        if (token || user) {
          if (role === "shop_owner") setCurrentView("shop-dashboard");
          else if (role === "rider") setCurrentView("rider-dashboard");
          else setCurrentView("dashboard");
        } else {
          setCurrentView("login");
        }
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentView, user]);

  // If on splash screen view
  if (currentView === "splash") {
    return <KhetiTakSplash />;
  }

  // If on login/register view
  if (currentView === "login") {
    return (
      <Login
        onSwitchToRegister={() => setCurrentView("register")}
        onNavigateShopLogin={() => setCurrentView("shop-login")}
        onNavigateRiderLogin={() => setCurrentView("rider-login")}
        onLoginSuccess={(role) => {
          if (role === "shop_owner") setCurrentView("shop-dashboard");
          else if (role === "rider") setCurrentView("rider-dashboard");
          else setCurrentView("dashboard");
        }}
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

  if (currentView === "shop-login") {
    return (
      <PartnerAuth
        defaultRole="shop_owner"
        onBackToFarmerLogin={() => setCurrentView("login")}
        onLoginSuccess={(role) => setCurrentView(role === "rider" ? "rider-dashboard" : "shop-dashboard")}
      />
    );
  }

  if (currentView === "rider-login") {
    return (
      <PartnerAuth
        defaultRole="rider"
        onBackToFarmerLogin={() => setCurrentView("login")}
        onLoginSuccess={(role) => setCurrentView(role === "shop_owner" ? "shop-dashboard" : "rider-dashboard")}
      />
    );
  }

  // Full-screen dedicated Partner Portals
  if (currentView === "shop-dashboard") {
    return <ShopDashboard setCurrentView={setCurrentView} />;
  }

  if (currentView === "rider-dashboard") {
    return <RiderDashboard setCurrentView={setCurrentView} />;
  }

  // Render Page Content
  const renderContent = () => {
    // If on mobile and accessing any farm tool, present the unified tabbed FarmTools view
    if (isMobile && ["tools", "crop", "disease", "weather", "mandi", "fertilizer"].includes(currentView)) {
      const activeTool = currentView === "tools" ? (selectedCropForCalc ? "fertilizer" : "crop") : currentView;
      return (
        <FarmTools
          setCurrentView={setCurrentView}
          defaultTool={activeTool}
        />
      );
    }

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
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
