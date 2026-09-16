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
import PublicSeoPage from "./pages/PublicSeoPage";
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
  login: "/login",
  register: "/register",
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
]);
const publicViews = new Set(["home", "about", "faq", "splash", "login", "register"]);

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
      if (path === "/") return "home";
      if (hash && ["splash", "dashboard", "crop", "disease", "assistant", "weather", "mandi", "fertilizer", "store", "orders", "profile", "tools"].includes(hash)) {
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
          window.history.pushState({ view }, "", "/");
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
      const routeView = pathToView[path] || hash;
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

  // Auto-navigate splash screen after 1.8s matching native cold-start feel
  useEffect(() => {
    if (currentView === "splash") {
      const timer = setTimeout(() => {
        const token = localStorage.getItem("accessToken");
        if (token || user) {
          setCurrentView("dashboard");
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

  if (publicViews.has(currentView) && ["home", "about", "faq"].includes(currentView)) {
    return <PublicSeoPage page={currentView} setCurrentView={setCurrentView} />;
  }

  if (authLoading && !publicViews.has(currentView)) {
    return <KhetiTakSplash />;
  }

  // Do not mount protected pages while a saved session is being rejected.
  // This prevents their effects from sending additional requests with a stale token.
  if (!authLoading && !user && !publicViews.has(currentView)) {
    return (
      <Login
        onSwitchToRegister={() => setCurrentView("register")}
        onLoginSuccess={() => setCurrentView("dashboard")}
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
