import axios from "axios";

// Local dev: "/api" is proxied to localhost:5000 by Vite.
// Live site: VITE_API_URL is set to the Render backend URL (e.g. https://xyz.onrender.com/api).
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

// Attach the JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
