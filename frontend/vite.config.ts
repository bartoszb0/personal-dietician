import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // listen on 0.0.0.0 so the dev server is reachable over the LAN
    // allow the ngrok tunnel host (Vite blocks unknown Host headers). Leading
    // dot matches any subdomain, so new ngrok URLs work without editing this.
    allowedHosts: [".ngrok-free.dev"],
    // proxy API calls to the backend so the app talks to it same-origin —
    // no CORS and no mixed content through the tunnel
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
