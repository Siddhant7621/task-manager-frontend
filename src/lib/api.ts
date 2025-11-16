import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("🌐 API URL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This is crucial for HTTP-only cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("accessToken");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Adding auth token to request:", config.url);
    } else {
      console.log("⚠️ No auth token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("🚨 Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error("🚨 API Error:", error.config?.url, error.response?.status);
    console.error("Error details:", error.response?.data);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 401 detected - starting token refresh process...");
      console.log("📋 Request details:", {
        url: originalRequest.url,
        method: originalRequest.method,
        hasAuthHeader: !!originalRequest.headers.Authorization,
      });

      originalRequest._retry = true;

      try {
        console.log("🔄 Calling /auth/refresh endpoint...");

        // Make the refresh call WITHOUT the interceptor to avoid infinite loops
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Important for cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Refresh response status:", refreshResponse.status);
        console.log("✅ Refresh response data:", refreshResponse.data);

        const newAccessToken = refreshResponse.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        console.log(
          "✅ New token received:",
          newAccessToken.substring(0, 20) + "..."
        );
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newAccessToken);
        }

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("🔄 Retrying original request with new token...");

        // Preserve body and params
        if (!originalRequest.data) originalRequest.data = {};
        if (!originalRequest.params) originalRequest.params = {};

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error("🚨 Token refresh failed:", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
        });

        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        console.log("🔒 Redirecting to login...");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.log("❌ Not a 401 or already retried - passing through error");
    return Promise.reject(error);
  }
);
