import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "in.khetitak.app",
  appName: "KhetiTak",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#FBF8F2",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
