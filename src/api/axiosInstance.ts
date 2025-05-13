// api/axiosInstance.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:44381/api",
  timeout: 10000,
  withCredentials: true,
});

import type { InternalAxiosRequestConfig } from "axios";

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Retrieve token from localStorage or other storage (e.g., cookies)
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error: AxiosError) => {
    // Handle request errors here if needed
    return Promise.reject(error);
  }
);

// Response interceptor to globally handle errors like 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Optional: clear tokens or user state here
      alert("Session expired. Please login again.");

      // Redirect to login page or a custom route
      window.location.href = "/login";

      // Reject with a custom error message
      return Promise.reject(new Error("Unauthorized: Please login."));
    }

    // Optional: Log other errors
    if (error.response) {
      console.error(
        `HTTP Error: ${error.response.status} - ${error.response.statusText}`,
        error.response.data
      );
    } else {
      console.error("Network or Axios error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
