import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://localhost:44381/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header with Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // must match stored key
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("Sending request with token:", token);
  } else {
    console.log("No token found in localStorage");
    if (config.headers) {
      delete config.headers["Authorization"];
    }
  }
  return config;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 404) {
        console.error("API endpoint not found:", error.config.url);
        // You can add custom 404 handling here, e.g., show notification
      }

      if (status === 401) {
        // Unauthorized: token expired or invalid
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        // Redirect to login page if not already there
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
