import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "Constance";

export const signOutTenant = createAsyncThunk(
    'tenants/signOutTenant',
    async ({ id, propertyid, userId, navigate }, { dispatch, rejectWithValue }) => {
      try {
        const res = await API.post(
          `api/tenents/signouttenants?_id=${id}&addedby=${userId}&propertyid=${propertyid}`
        );
        
        dispatch(showSnackbar({
          message: res?.data?.message || "Successfully signed out",
          severity: "success",
        }));
  
        return res.data;
      } catch (error) {
        if (error.response?.status === 409) {
          dispatch(logout());
          navigate('/auth/login');
        } else {
          dispatch(showSnackbar({
            message: error.response?.data?.message || "An error occurred",
            severity: "error",
          }));
        }
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
    }
  );