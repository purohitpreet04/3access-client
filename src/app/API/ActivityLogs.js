import { setIsLoading } from "@app/Redux/Sclice/manageStateSclice";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "Constance";

export const fetchActivityLogs = createAsyncThunk(
    'activitylog/fetchlogs',
    async ({ userId, page = 1, rowsPerPage, searchQuery, Filter, navigation }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setIsLoading({ data: true }))
            try {
                const res = await API.get('/api/user/getuserlogs', {
                    params: {
                        userId,
                        page: page,
                        limit: rowsPerPage,
                        search: searchQuery,
                        filterby: Filter
                    }
                });
                if (res.data.success === true) {
                    dispatch(setIsLoading({ data: false }))
                    return res.data
                }
                // console.log(res);
            } catch (error) {
                dispatch(setIsLoading({ data: false }))
                if (error.response?.status === 409) {
                    dispatch(logout());
                    navigation('/auth/login');
                } else {
                    dispatch(showSnackbar({
                        message: error.response?.data?.message || "An error occurred",
                        severity: "error"
                    }));
                }
            }
        } catch (error) {
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }
);