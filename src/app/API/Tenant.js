import { setIsLoading } from "@app/Redux/Sclice/manageStateSclice";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "Constance";
import { confirm } from "react-confirm-box";

export const signOutTenant = createAsyncThunk(
  'tenants/signOutTenant',
  async ({ id, propertyid, userId, navigate, withOutMail, signOutDate, signature, isPresent, password }, { dispatch, rejectWithValue }) => {

    // if (await confirm('Are you sure you want to sign out this tenant?')) {
    try {
      dispatch(setIsLoading({ data: true }))
      const res = await API.post(
        `api/tenents/signouttenants?_id=${id}&addedby=${userId}&propertyid=${propertyid}`,
        {
          withOutMail,
          signOutDate,
          signature,
          isPresent,
          password
        }
      );

      dispatch(showSnackbar({
        message: res?.data?.message || "Successfully signed out",
        severity: "success",
      }));

      dispatch(setIsLoading({ data: false }))
      return res.data;
    } catch (error) {
      dispatch(setIsLoading({ data: false }))
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
  // }
);

export const CheckHasOneStaff = createAsyncThunk(
  'tenants/CheckHasOneStaff',
  async ({ navigation, p, r }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading({ data: true }))
      const res = await API.get('/api/user/checkhasstaff')
      if (res.data.success && res.data.hasStaffOrAgent) {
        dispatch(showSnackbar({
          message: "You already have staff or agent. Please add tenants.",
          severity: "info"
        }));
        if (p && r) {
          navigation(`/services/addtenants?p=${p}&r=${r}`)
        } else {
          navigation('/services/addtenants')
        }
        dispatch(setIsLoading({ data: false }))
      } else {
        dispatch(showSnackbar({
          message: "You don't have any staff or agent. Please add staff first.",
          severity: "info"
        }));
        navigation('/services/staff?open=true')
        dispatch(setIsLoading({ data: false }))
      }
    } catch (error) {
      dispatch(setIsLoading({ data: false }))
      dispatch(showSnackbar({
        message: error.response?.data?.message || "An error occurred",
        severity: "error"
      }));
    }
  }
);


export const HandleApprovalOfTenants = createAsyncThunk(
  'tenants/HandleApprovalOfTenants',
  async ({ navigation, tenantId, approved_status, propertyid }, { dispatch, rejectWithValue }) => {
    if (await confirm('Are You Sure?', {
      closeOnOverlayClick: false,
    })) {
      try {
        dispatch(setIsLoading({ data: true }))
        const res = await API.get('/api/tenents/change-tenants-status', { params: { approved_status, _id: tenantId, propertyid } })
        if (res.data.success && res.data.hasStaffOrAgent) {
          dispatch(setIsLoading({ data: false }))
        } else {
          dispatch(showSnackbar({
            message: "You don't have any staff or agent. Please add staff first.",
            severity: "info"
          }));
          navigation('/desh')
          dispatch(setIsLoading({ data: false }))
        }
      } catch (error) {
        dispatch(setIsLoading({ data: false }))
        dispatch(showSnackbar({
          message: error.response?.data?.message || "An error occurred",
          severity: "error"
        }));
      }
    } else {
      return false
    }

  }
)


export const handleEditTenant = createAsyncThunk(
  'tenants/handleEditTenant',
  async ({ _id }, { dispatch, rejectWithValue }) => {

    try {
      dispatch(setIsLoading({ data: true }))
      const res = await API.get('/api/tenents/get-all-details', { params: { _id } })
      if (res.status === 200) {
        dispatch(setIsLoading({ data: false }))
        return res.data.tenant
      }
      dispatch(setIsLoading({ data: false }))
    } catch (error) {
      rejectWithValue(error)
      dispatch(setIsLoading({ data: false }))
      dispatch(showSnackbar({
        message: error.response?.data?.message || "An error occurred while fetching tenant details!",
        severity: "error"
      }));
    }

  })


export const handleExistingExelFileExport = createAsyncThunk(
  'tenants/handleEditTenant',
  async ({ formData, setFieldValue }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading({ data: true }))
      const result = await API.post("api/tenents/import-tenants", formData)
      if (result.success) {
        setFieldValue('path', result?.data?.path)
        dispatch(showSnackbar({ message: result.data.message || 'File Uploaded', severity: 'success' }))
      } else {
        dispatch(showSnackbar({ message: result.error, severity: 'error' }))
      }
      dispatch(setIsLoading({ data: false }))
    } catch (error) {
      dispatch(setIsLoading({ data: false }))
      dispatch(showSnackbar({ message: error.message || 'File upload error', severity: 'error' }))
    }
  }
)
