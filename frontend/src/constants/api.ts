export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://threed-viewer-309u.onrender.com"
    : "http://localhost:5001");
