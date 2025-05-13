// api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:44381/api",
  timeout: 10000,
  withCredentials: true, // for cookies if used
});

// Add Authorization header if token exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // You can do more here: logout user, clear tokens, redirect, etc.
      alert("Session expired. Please login again.");
      window.location.href = "/login"; 
      return Promise.reject(new Error("Unauthorized: Please login."));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
