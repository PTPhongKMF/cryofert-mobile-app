import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isWebPreview = process.env.WEB_PREVIEW === "true";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy(), tailwindcss(), tsconfigPaths()],
  define: {
    __WEB_PREVIEW__: JSON.stringify(isWebPreview),
  },
  preview: {
    port: 3000,
  },
});
