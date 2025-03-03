import { setIsLoading } from "@app/Redux/Sclice/manageStateSclice";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "Constance";

export const HandleArchiveStaff = createAsyncThunk("staff/handleArchiveStaff", async (payload, { dispatch }) => {
    try {


        dispatch(setIsLoading({ data: true }))
        const res = await API.get('/api/staff/archivestaff', {
            params: {
                ...payload
            }
        });
        if (res.data.success === true) {
            if (res?.data?.message) {
                dispatch(showSnackbar({ message: res?.data?.message || "Staff Archived Successfully", severity: res?.data?.severity || "success" }));
            }
            dispatch(setIsLoading({ data: false }))
            return res.data
        }
    } catch (error) {
        dispatch(setIsLoading({ data: false }))
        dispatch(showSnackbar({
            message: error.response?.data?.message || "An error occurred",
            severity: "error"
        }));
    }
});

export const Restorestaff = createAsyncThunk("staff/Restorestaff", async (payload, { dispatch }) => {
    try {


        dispatch(setIsLoading({ data: true }))
        const res = await API.get('/api/staff/restore-staff', {
            params: {
                ...payload
            }
        });
        if (res.data.success === true) {
            if (res?.data?.message) {
                dispatch(showSnackbar({ message: res?.data?.message || "Staff Restored Successfully", severity: res?.data?.severity || "success" }));
            }
            dispatch(setIsLoading({ data: false }))
            return res.data
        }
    } catch (error) {
        dispatch(setIsLoading({ data: false }))
        dispatch(showSnackbar({
            message: error.response?.data?.message || "An error occurred",
            severity: "error"
        }));
    }
});

export const transferWork = createAsyncThunk("staff/transferWork", async (payload, { dispatch }) => {
    try {


        dispatch(setIsLoading({ data: true }))
        const res = await API.post('/api/staff/transferWork', payload);
        if (res.data.success === true) {
            if (res?.data?.message) {
                dispatch(showSnackbar({ message: res?.data?.message || "Staff Restored Successfully", severity: res?.data?.severity || "success" }));
            }
            dispatch(setIsLoading({ data: false }))
            return res.data
        }
    } catch (error) {
        dispatch(setIsLoading({ data: false }))
        dispatch(showSnackbar({
            message: error.response?.data?.message || "An error occurred",
            severity: "error"
        }));
    }
});