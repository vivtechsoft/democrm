import apiClient from "../../services/apiClient";

const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

const mockUser = {
  id: "u1",
  name: "Demo User",
  email: "demo@crm.local",
  roles: ["ADMIN", "SALES"],
};

const authService = {
  async login({ email, password }) {
    if (USE_MOCKS) {
      // naive mock: accept any credentials
      return Promise.resolve({
        data: { token: "mock-token-123", user: mockUser },
      });
    }
    const resp = await apiClient.post("/auth/login", { email, password });
    return resp;
  },

  logout() {
    // If you need server-side logout, call endpoint here.
    return Promise.resolve();
  },

  getProfile() {
    if (USE_MOCKS) {
      return Promise.resolve({ data: mockUser });
    }
    return apiClient.get("/auth/profile");
  },
};

export default authService;
