import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

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
import PublicSeoPage from "./pages/PublicSeoPage";
import LegalPage from "./pages/LegalPage";
import { KhetiTakSplash } from "./components/KhetiTakBranding";

const viewPaths = {
  home: "/",
  about: "/about",
  faq: "/faq",
  dashboard: "/dashboard",
  crop: "/crop-recommendation",
  disease: "/crop-disease",
  assistant: "/ai-assistant",
  weather: "/weather",
  mandi: "/mandi-bhav",
  fertilizer: "/fertilizer-calculator",
  store: "/store",
  orders: "/orders",
  profile: "/profile",
  tools: "/farm-tools",
  "shop-dashboard": "/shop-dashboard",
  "rider-dashboard": "/rider-dashboard",
  "shop-login": "/shop-login",
  "rider-login": "/rider-login",
  login: "/login",
  register: "/register",
  terms: "/terms",
  privacy: "/privacy",
  "refund-policy": "/refund-policy",
  "shipping-policy": "/shipping-policy",
};

const pathToView = Object.fromEntries(Object.entries(viewPaths).map(([view, path]) => [path, view]));
const protectedViews = new Set([
  "dashboard",
  "crop",
  "disease",
  "assistant",
  "weather",
  "mandi",
  "fertilizer",
  "store",
  "orders",
  "profile",
  "tools",
  "shop-dashboard",
  "rider-dashboard",
]);
const publicViews = new Set([
  "home",
  "about",
  "faq",
  "splash",
  "login",
  "register",
  "shop-login",
  "rider-login",
  "terms",
  "privacy",
  "refund-policy",
  "shipping-policy",
]);

function updatePageMetadata(view) {
  const metadata = {
    home: {
      title: "KhetiTak — खेती का भरोसा, आपके पास | Smart Agriculture",
      description: "KhetiTak brings smart crop advisory, mandi bhav, weather insights, crop disease information and agri products for Indian farmers.",
      robots: "index,follow",
    },
    about: {
      title: "About KhetiTak | Agriculture Tools for Indian Farmers",
      description: "Learn how KhetiTak brings crop planning, weather, mandi information and agri products together for Indian farmers.",
      robots: "index,follow",
    },
    faq: {
      title: "KhetiTak FAQ | Agriculture Platform Questions",
      description: "Answers about KhetiTak agriculture tools, data context, farmer accounts and market information.",
      robots: "index,follow",
    },
    login: {
      title: "Sign In | KhetiTak",
      description: "Sign in to access your KhetiTak farmer dashboard and agriculture tools.",
      robots: "noindex,nofollow",
    },
    register: {
      title: "Create Account | KhetiTak",
      description: "Create your KhetiTak farmer account to access agriculture advisory and farm tools.",
      robots: "noindex,nofollow",
    },
    "shop-login": {
      title: "Shop & Agency Partner Sign In | KhetiTak",
      description: "Merchant portal for KhetiTak fertilizer and seed dealerships.",
      robots: "noindex,nofollow",
    },
    "rider-login": {
      title: "Delivery Partner Sign In | KhetiTak",
      description: "Captain & Rider fleet portal for KhetiTak agri logistics.",
      robots: "noindex,nofollow",
    },
    "shop-dashboard": {
      title: "Shop Management Hub | KhetiTak",
      description: "Live farmer orders and stock management.",
      robots: "noindex,nofollow",
    },
    "rider-dashboard": {
      title: "Delivery Fleet Captain Hub | KhetiTak",
      description: "Live ride orders and village deliveries.",
      robots: "noindex,nofollow",
    },
    terms: {
      title: "Terms & Conditions | KhetiTak",
      description: "Terms for using KhetiTak agriculture advisory and local agri-input marketplace services.",
      robots: "index,follow",
    },
    privacy: {
      title: "Privacy Policy | KhetiTak",
      description: "Learn how KhetiTak handles farmer account, recommendation and order information.",
      robots: "index,follow",
    },
    "refund-policy": {
      title: "Refund & Cancellation Policy | KhetiTak",
      description: "KhetiTak policy for COD order cancellations, damaged items and wrong-item resolutions.",
      robots: "index,follow",
    },
    "shipping-policy": {
      title: "Shipping & Delivery Policy | KhetiTak",
      description: "Delivery areas, timelines and delay handling for KhetiTak local dealer orders.",
      robots: "index,follow",
    },
  }[view] || {
    title: `${view === "mandi" ? "Mandi Bhav" : "KhetiTak Agriculture Tools"} | KhetiTak`,
    description: "KhetiTak agriculture tools for crop planning, mandi information, weather and farmer support.",
    robots: protectedViews.has(view) ? "noindex,nofollow" : "index,follow",
  };

  document.title = metadata.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", metadata.description);
  const robots = document.querySelector('meta[name="robots"]') || document.createElement("meta");
  robots.setAttribute("name", "robots");
  robots.setAttribute("content", metadata.robots);
  if (!robots.parentNode) document.head.appendChild(robots);

  const canonical = document.querySelector('link[rel="canonical"]') || document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", `https://khetitak.in${view === "login" || view === "register" ? `/${view}` : view === "/" ? "/" : viewPaths[view] || "/"}`);
  if (!canonical.parentNode) document.head.appendChild(canonical);
}

function MainApp() {
  const { user, loading: authLoading } = useAuth();

  const getInitialView = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace("#", "");

      if (pathToView[path]) return pathToView[path];
      if (path === "/splash" || hash === "splash") return "splash";
      if (path === "/login" || hash === "login") return "login";
      if (path === "/register" || hash === "register") return "register";
      if (hash === "shop-login" || hash === "rider-login") return hash;
      if (hash === "shop-dashboard" || hash === "rider-dashboard") return hash;
      if (path === "/") return "home";
      if (hash && ["splash", "dashboard", "crop", "disease", "assistant", "weather", "mandi", "fertilizer", "store", "orders", "profile", "tools", "shop-login", "rider-login", "shop-dashboard", "rider-dashboard"].includes(hash)) {
        return hash;
      }

      return "home";
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
        const nextPath = viewPaths[view];
        if (nextPath) {
          window.history.pushState({ view }, "", nextPath);
        } else {
          window.history.pushState({ view }, "", `/#${view}`);
        }
      } catch {
        window.location.hash = view;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace("#", "");
      const routeView = hash && pathToView[`/${hash}`] ? hash : pathToView[path] || hash;
      if (routeView && [...publicViews, ...protectedViews].includes(routeView)) {
        setCurrentViewState(routeView);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    updatePageMetadata(currentView);
  }, [currentView]);

  useEffect(() => {
    if (user?.role === "shop_owner" && ["dashboard", "home"].includes(currentView)) {
      setCurrentViewState("shop-dashboard");
    } else if (user?.role === "rider" && ["dashboard", "home"].includes(currentView)) {
      setCurrentViewState("rider-dashboard");
    }
  }, [user?.role, currentView]);

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
          setCurrentView("home");
        }
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentView, user]);

  // If on splash screen view
  if (currentView === "splash") {
    return <KhetiTakSplash />;
  }

  // Legal Pages
  if (["terms", "privacy", "refund-policy", "shipping-policy"].includes(currentView)) {
    return <LegalPage page={currentView} setCurrentView={setCurrentView} />;
  }

  // Public Landing / About / FAQ Pages
  if (publicViews.has(currentView) && ["home", "about", "faq"].includes(currentView)) {
    return <PublicSeoPage page={currentView} setCurrentView={setCurrentView} />;
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

  // Standalone dedicated partner apps
  if (currentView === "shop-dashboard") {
    return <ShopDashboard setCurrentView={setCurrentView} />;
  }

  if (currentView === "rider-dashboard") {
    return <RiderDashboard setCurrentView={setCurrentView} />;
  }

  if (authLoading && !publicViews.has(currentView)) {
    return <KhetiTakSplash />;
  }

  // Do not mount protected pages while a saved session is being rejected.
  if (!authLoading && !user && !publicViews.has(currentView)) {
    return (
      <Login
        onSwitchToRegister={() => setCurrentView("register")}
        onNavigateShopLogin={() => setCurrentView("shop-login")}
        onNavigateRiderLogin={() => setCurrentView("rider-login")}
        onLoginSuccess={(role) => setCurrentView(role === "shop_owner" ? "shop-dashboard" : role === "rider" ? "rider-dashboard" : "dashboard")}
      />
    );
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
        <Footer setCurrentView={setCurrentView} />
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
