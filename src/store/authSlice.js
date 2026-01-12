import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../modules/auth/auth.service";

const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const userFromStorage = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;

export const login = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const resp = await authService.login(creds);
    return resp.data;
  } catch (e) {
    return rejectWithValue(e?.response?.data?.message || e.message);
  }
});

const slice = createSlice({
  name: "auth",
  initialState: {
    token: tokenFromStorage,
    user: userFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem("token", a.payload.token);
        localStorage.setItem("user", JSON.stringify(a.payload.user));
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error?.message; });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
