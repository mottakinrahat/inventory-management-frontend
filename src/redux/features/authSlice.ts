import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: any;
  user: any | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
};
console.log(initialState)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload.accessToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
