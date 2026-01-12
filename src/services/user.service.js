import apiClient from "./apiClient";

const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

const mockUsers = [
  { id: "u1", name: "Alice", email: "alice@crm.local", roles: ["SALES"] },
  { id: "u2", name: "Bob", email: "bob@crm.local", roles: ["VIEWER"] },
];

const userService = {
  list() {
    if (USE_MOCKS) return Promise.resolve({ data: mockUsers });
    return apiClient.get("/users");
  },
  get(id) {
    if (USE_MOCKS) return Promise.resolve({ data: mockUsers.find((u) => u.id === id) });
    return apiClient.get(`/users/${id}`);
  },
};

export default userService;
