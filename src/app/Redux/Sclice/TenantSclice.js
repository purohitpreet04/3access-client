import { signOutTenant } from '@app/API/Tenant';
import { createSlice } from '@reduxjs/toolkit';

const tenantSlice = createSlice({
  name: 'tenants',
  initialState: {
    isLoading: false,
    tenants: [],
    error: null,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signOutTenant.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOutTenant.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signOutTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsLoading } = tenantSlice.actions;
export default tenantSlice.reducer;
