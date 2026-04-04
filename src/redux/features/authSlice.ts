import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: any;
  accessToken: string | null;
  user: any | null;
}

const initialState: AuthState = {
  user: null,
  // ✅ Single token field — reads from localStorage on startup for refresh survival
  accessToken: typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null,
  token: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      // ✅ Saves to .accessToken — matches what apiSlice.prepareHeaders reads
      state.accessToken = action.payload.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload.accessToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;