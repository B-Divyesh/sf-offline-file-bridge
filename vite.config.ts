import { defineConfig } from "vite";
import { buildMetadata } from "./scripts/build-metadata.mjs";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(buildMetadata.version),
    __BUILD_COMMIT__: JSON.stringify(buildMetadata.commit)
  },
  build: {
    target: "es2022",
    sourcemap: true,
    assetsInlineLimit: 2048
  }
});
