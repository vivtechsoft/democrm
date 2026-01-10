import { createSlice } from '@reduxjs/toolkit';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@indo-crm.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    email: 'manager@indo-crm.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    email: 'user@indo-crm.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
  users: mockUsers,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = authSlice.actions;

// Async thunk for login
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      // Create token (in real app, this comes from backend)
      const token = `mock-jwt-token-${user.id}`;
      
      dispatch(loginSuccess({
        user: { ...user, password: undefined },
        token,
      }));
      
      return { success: true };
    } else {
      dispatch(loginFailure('Invalid email or password'));
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

export default authSlice.reducer;