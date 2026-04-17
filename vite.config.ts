import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/data/ancestries/core/")) {
            return "core-ancestries";
          }
          if (id.includes("/data/skills/core")) {
            return "core-skills";
          }
        },
      },
    },
  },
});
