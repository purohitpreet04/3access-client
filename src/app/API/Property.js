import { setIsLoading } from "@app/Redux/Sclice/manageStateSclice";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import { staffuser } from "@app/Utils/constant";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "Constance";

export const fetchProperties = createAsyncThunk(
    'property/fetchProperties',
    async ({ user, page = 1, rowsPerPage, searchQuery, roleFilter, navigation }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setIsLoading({ data: true }))
            let params = {};
                if (staffuser.includes(user?.role)) {
                    params.staffAddedByrole = user?.addedBy?.role
                    params.staffAddedBy = user?.addedBy?._id
                }
            try {
                const res = await API.get('/api/property/getallproperty', {
                    params: {
                        _id: user?._id,
                        role: user?.role,
                        page: page,
                        limit: rowsPerPage,
                        search: searchQuery,
                        filterby: roleFilter
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