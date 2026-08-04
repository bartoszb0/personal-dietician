import axios from "axios"

export const api = axios.create({
  // same-origin path — the Vite dev server proxies /api to the backend, so it
  // works over localhost, the LAN IP, and the ngrok tunnel without CORS or
  // mixed-content issues. In prod, set VITE_API_URL to the real backend URL.
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
})
