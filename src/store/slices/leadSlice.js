import { createSlice, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Mock leads data
const mockLeads = Array.from({ length: 20 }, (_, i) => ({
  id: uuidv4(),
  name: `Lead ${i + 1}`,
  email: `lead${i + 1}@example.com`,
  phone: `+62${8000000000 + i}`,
  company: `Company ${(i % 5) + 1}`,
  status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won'][i % 6],
  source: ['website', 'referral', 'social', 'email', 'event'][i % 5],
  value: Math.floor(Math.random() * 50000) + 10000,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  assignedTo: `user${(i % 3) + 1}@indo-crm.com`,
  notes: `This is lead ${i + 1} with some important notes...`,
}));

const initialState = {
  leads: mockLeads,
  currentLead: null,
  isLoading: false,
  error: null,
  filters: {
    status: '',
    source: '',
    search: '',
  },
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload;
    },
    addLead: (state, action) => {
      state.leads.unshift({
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      });
    },
    updateLead: (state, action) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = { ...state.leads[index], ...action.payload };
      }
    },
    deleteLead: (state, action) => {
      state.leads = state.leads.filter(lead => lead.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Selectors
export const selectLeadsState = (state) => state.leads;

export const selectAllLeads = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState.leads
);

export const selectCurrentLead = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState.currentLead
);

export const selectLeadsLoading = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState.isLoading
);

export const selectLeadsError = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState.error
);

export const selectLeadFilters = createSelector(
  [selectLeadsState],
  (leadsState) => leadsState.filters
);

export const selectFilteredLeads = createSelector(
  [selectAllLeads, selectLeadFilters],
  (leads, filters) => {
    if (!filters.status && !filters.source && !filters.search) {
      return leads;
    }

    return leads.filter((lead) => {
      // Filter by status
      if (filters.status && lead.status !== filters.status) {
        return false;
      }

      // Filter by source
      if (filters.source && lead.source !== filters.source) {
        return false;
      }

      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(searchTerm);
        const matchesEmail = lead.email.toLowerCase().includes(searchTerm);
        const matchesCompany = lead.company.toLowerCase().includes(searchTerm);
        const matchesPhone = lead.phone.toLowerCase().includes(searchTerm);
        
        if (!(matchesName || matchesEmail || matchesCompany || matchesPhone)) {
          return false;
        }
      }

      return true;
    });
  }
);

// Statistics selectors
export const selectLeadsStats = createSelector(
  [selectAllLeads],
  (leads) => {
    const stats = {
      total: leads.length,
      byStatus: {},
      bySource: {},
      totalValue: 0,
    };

    leads.forEach(lead => {
      // Status stats
      stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;
      
      // Source stats
      stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1;
      
      // Total value
      stats.totalValue += lead.value;
    });

    return stats;
  }
);

export const selectRecentLeads = createSelector(
  [selectAllLeads],
  (leads) => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }
);

export const {
  setLeads,
  setCurrentLead,
  addLead,
  updateLead,
  deleteLead,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  clearError,
} = leadSlice.actions;

export default leadSlice.reducer;