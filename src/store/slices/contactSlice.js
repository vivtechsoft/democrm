import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Mock contacts data
const mockContacts = Array.from({ length: 15 }, (_, i) => ({
  id: uuidv4(),
  firstName: `First${i + 1}`,
  lastName: `Last${i + 1}`,
  email: `contact${i + 1}@example.com`,
  phone: `+62${8000000000 + i}`,
  company: `Company ${(i % 5) + 1}`,
  jobTitle: ['CEO', 'Manager', 'Developer', 'Sales', 'Marketing'][i % 5],
  department: ['Executive', 'Sales', 'IT', 'Marketing', 'Operations'][i % 5],
  status: 'active',
  lastContacted: new Date(Date.now() - i * 2 * 86400000).toISOString(),
  notes: `Important contact details for ${i + 1}...`,
}));

const initialState = {
  contacts: mockContacts,
  currentContact: null,
  isLoading: false,
  error: null,
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
    addContact: (state, action) => {
      state.contacts.unshift({
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      });
    },
    updateContact: (state, action) => {
      const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = { ...state.contacts[index], ...action.payload };
      }
    },
    deleteContact: (state, action) => {
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
    },
  },
});

export const {
  setContacts,
  setCurrentContact,
  addContact,
  updateContact,
  deleteContact,
} = contactSlice.actions;

export default contactSlice.reducer;