import { setData } from "@app/Redux/Sclice/MultiSelectSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "Constance";

export const getAllRSL = createAsyncThunk(
  'sideselect/getAllRSL',
  async ({ user, navigate, isMainMa }, { dispatch, rejectWithValue }) => {
    let Otherparams = {}
    if (['staff'].includes(user?.role)) {
      Otherparams["addedBy"] = user?.addedBy?._id
    }
    try {
      const res = await API.get(`api/rsl/getallRsl`, { params: { _id: user?._id, isMainMa, role: user?.role, ...Otherparams } });

      dispatch(setData(res.data))
      if (res?.data?.message) {

        dispatch(showSnackbar({
          message: res?.data?.message,
          severity: "success",
        }));
      }
      // return res.data;
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