import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import leadsService from "../modules/leads/leads.service";

export const fetchLeads = createAsyncThunk("leads/fetch", async (_, { rejectWithValue }) => {
  try {
    const resp = await leadsService.list();
    return resp.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

export const createLead = createAsyncThunk("leads/create", async (payload, { rejectWithValue }) => {
  try {
    const resp = await leadsService.create(payload);
    return resp.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

export const updateLead = createAsyncThunk("leads/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const resp = await leadsService.update(id, payload);
    return resp.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

export const deleteLead = createAsyncThunk("leads/delete", async (id, { rejectWithValue }) => {
  try {
    await leadsService.remove(id);
    return id;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

const slice = createSlice({
  name: "leads",
  initialState: { items: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (s) => { s.loading = true; })
      .addCase(fetchLeads.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.items; s.total = a.payload.total; })
      .addCase(fetchLeads.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error?.message; })

      .addCase(createLead.fulfilled, (s, a) => { s.items.unshift(a.payload); s.total += 1; })
      .addCase(updateLead.fulfilled, (s, a) => { s.items = s.items.map((it) => (it.id === a.payload.id ? a.payload : it)); })
      .addCase(deleteLead.fulfilled, (s, a) => { s.items = s.items.filter((it) => it.id !== a.payload); s.total -= 1; });
  },
});

export default slice.reducer;
