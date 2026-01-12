import apiClient from "../../services/apiClient";

const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

const sampleLeads = [
  { id: "l1", name: "Acme Corp", email: "contact@acme.com", status: "NEW", owner: "Alice" },
  { id: "l2", name: "Beta LLC", email: "hello@beta.com", status: "CONTACTED", owner: "Bob" },
];

const leadsService = {
  async list(params) {
    if (USE_MOCKS) {
      return Promise.resolve({ data: { items: sampleLeads, total: sampleLeads.length } });
    }
    return apiClient.get("/leads", { params });
  },

  async getById(id) {
    if (USE_MOCKS) {
      const item = sampleLeads.find((l) => l.id === id);
      return Promise.resolve({ data: item || null });
    }
    return apiClient.get(`/leads/${id}`);
  },

  async create(payload) {
    if (USE_MOCKS) {
      const newItem = { id: `l${Date.now()}`, ...payload };
      sampleLeads.push(newItem);
      return Promise.resolve({ data: newItem });
    }
    return apiClient.post("/leads", payload);
  },

  async update(id, payload) {
    if (USE_MOCKS) {
      const idx = sampleLeads.findIndex((l) => l.id === id);
      if (idx >= 0) sampleLeads[idx] = { ...sampleLeads[idx], ...payload };
      return Promise.resolve({ data: sampleLeads[idx] });
    }
    return apiClient.put(`/leads/${id}`, payload);
  },

  async remove(id) {
    if (USE_MOCKS) {
      const idx = sampleLeads.findIndex((l) => l.id === id);
      if (idx >= 0) sampleLeads.splice(idx, 1);
      return Promise.resolve({ data: true });
    }
    return apiClient.delete(`/leads/${id}`);
  },
};

export default leadsService;
