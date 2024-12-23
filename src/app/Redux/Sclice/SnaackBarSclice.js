// src/redux/snackbarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snack',
  initialState: {
    open: false,
    message: '',
    severity: 'info', // info, success, warning, error
  },
  reducers: {
    showSnackbar: (state, action) => {
        // console.log('jshjjsdh', state.message, state.open, state.severity)
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || 'info';
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.message = '';
      state.severity = 'info';
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
