import { createSlice } from '@reduxjs/toolkit';

type AuthState = { user: { id: string; name: string } | null };
const init: AuthState = { user: { id: '1', name: 'Студент' } };
const authSlice = createSlice({
  name: 'auth',
  initialState: init,
  reducers: {},
});

export default authSlice.reducer;