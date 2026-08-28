import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "in.sociobot.offline_file_bridge",
  appName: "Offline File Bridge",
  webDir: "dist",
  android: {
    allowMixedContent: false,
    backgroundColor: "#F4EEDC"
  }
};

export default config;
