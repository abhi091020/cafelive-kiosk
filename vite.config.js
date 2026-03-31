// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// ══════════════════════════════════════════════════════════════════════════
// KIOSK CONFIGURATION - 15" Portrait Display (1080×1920)
// ══════════════════════════════════════════════════════════════════════════

// ── Backend API URL ───────────────────────────────────────────────────────
// Change this IP when backend dev switches laptops
const BACKEND_URL = "http://192.168.10.120:8000";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@common": fileURLToPath(new URL("./src/components/common", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@context": fileURLToPath(new URL("./src/context", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@locales": fileURLToPath(new URL("./src/locales", import.meta.url)),
      "@mock": fileURLToPath(new URL("./src/mock", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
    },
  },

  // ── Development Server ────────────────────────────────────────────────────
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    open: false,
    cors: true,

    // ── Proxy — routes /api → backend, bypasses CORS ─────────────────────
    // Only change BACKEND_URL above when backend IP changes
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // ── Preview Server ────────────────────────────────────────────────────────
  preview: {
    port: 4173,
    host: "0.0.0.0",
    strictPort: true,
  },

  // ── Build Optimizations ───────────────────────────────────────────────────
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.info", "console.debug", "console.warn"],
      },
      format: { comments: false },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          i18n: ["i18next", "react-i18next"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    target: "es2020",
  },

  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.webp"],
  css: { devSourcemap: true },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "i18next", "react-i18next"],
  },
});