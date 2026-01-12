import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor: attach token
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor: handle 401 centrally
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // optional: broadcast logout, or window.location = '/login'
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
