import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from 'Constance';
import { json, Navigate } from 'react-router-dom';
import { showSnackbar } from './SnaackBarSclice'
import { useDispatch } from 'react-redux';
import { setIsLoading } from './manageStateSclice';
import { handeAgentCount } from './MultiSelectSlice';


export const login = createAsyncThunk(
    'auth/login',
    async (value, { rejectWithValue, dispatch }) => {
        try {
            const { data, navigate } = value
            dispatch(setIsLoading({ data: true }));
            const res = await API.post('/api/auth/login', data)

            if (res.status === 200 && res.data.user?._id) {
                localStorage.setItem('authToken', JSON.stringify(res.data.token))
                localStorage.setItem('user', JSON.stringify({ _id: res.data.user?._id, role: res.data.user?.role }))

                let token = await JSON.parse(localStorage.getItem('authToken'))
                if (token) {

                    dispatch(showSnackbar({ message: 'Register successful', severity: 'success' }));
                    dispatch(setIsLoading({ data: false }));
                    navigate('/desh')
                    return { user: res.data.user, token: token, isAuthenticate: true }
                }

            } else {
                dispatch(setIsLoading({ data: false }));
                dispatch(showSnackbar({ message: res.data.message, severity: res.data.severity }));
                return { user: {}, token: null, isAuthenticate: false }
            }
        } catch (error) {
            // console.log(error)
            dispatch(setIsLoading({ data: false }));
            dispatch(showSnackbar({ message: error.response.data.message, severity: error.response.data.severity }))
            return { user: {}, token: null, isAuthenticate: false, loading: false }
            // return rejectWithValue(error.message);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (value, { rejectWithValue, dispatch }) => {
        const { data, navigate } = value
        try {

            dispatch(setIsLoading({ data: true }));
            const res = await API.post('/api/auth/register', data)
            if (res.data.token && res.data.success === true && res.status === 200) {
                await localStorage.setItem('authToken', JSON.stringify(res.data.token))
                localStorage.setItem('user', JSON.stringify({ _id: res.data.user?._id, role: res.data.user?.role }))
                let token = await JSON.parse(localStorage.getItem('authToken'))
                if (token) {
                    dispatch(showSnackbar({ message: 'Register successful', severity: 'success' }));
                    dispatch(setIsLoading({ data: false }));
                    navigate('/desh')
                    return { user: res.data.user, token: token, isAuthenticate: true }
                }
            }
            else {

                // navigate('/auth/login')
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }));
                dispatch(setIsLoading({ data: false }));
                // return { user: {}, token: null, isAuthenticate: false }
            }

        } catch (error) {
            // if (error.status == 400) {
            //     navigate('/auth/login')
            // }
            // if (error.status == 409) {
            //     navigate(`/auth/login?page=${error.response.data.page}`,)
            // }
            // return rejectWithValue(error.response.data.error);
            dispatch(setIsLoading({ data: false }));
            dispatch(showSnackbar({ message: error.response.data.error, severity: error.response.data.severity }))
        }
    }
);


export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (value, { rejectWithValue, dispatch }) => {
        const { data, navigate } = value
        try {
            // console.log(data)
            // return
            const res = await API.post('/auth/updateprofile', data, { headers: { 'Content-Type': 'Application/JSON' } })
            if (res.status == 201 && res.data?._id) {

                // await localStorage.setItem('user', JSON.stringify(res.data))
                dispatch(showSnackbar({ message: 'Profile Updated..', severity: 'success' }));
                return { user: res.data }
            } else {
                dispatch(showSnackbar({ message: res.data.message || 'Something Went Wrong , react', severity: 'error' }));
                return { user: {} }
            }

        } catch (error) {
            if (error.status == 400) {
                navigate('/auth/login')
            }
            dispatch(showSnackbar({ message: error.response.data.message, severity: error.response.data.severity }))
            return rejectWithValue(error.message);
        }
    }
);


export const fetchUserDetails = createAsyncThunk(
    "auth/fetchUserDetails",
    async (value, { rejectWithValue, dispatch }) => {
        const { navigate } = value;

        try {
            let userdata = JSON.parse(localStorage.getItem("user"));
            let user = userdata;

            if (!userdata?._id) {
                return { user: {}, isAuthenticate: false };
            }

            const { data, ...res } = await API.get("/api/user/fetchuserdetails", {
                params: { _id: user?._id, role: user?.role },
            });

            if (data?.user?._id) {
                if (data.user.isMainMA == 1) {
                    dispatch(handeAgentCount({ active: data.user.active, inactive: data.user.inactive }))
                }
                return { user: data.user, isAuthenticate: true };
            } else {
                dispatch(
                    showSnackbar({ message: "Access Denied", severity: "error" })
                );
                return { user: {}, isAuthenticate: false };
            }
        } catch (error) {
            if (error.response?.status === 401 || 404 || 409) {
                // Dispatch the logout action here
                dispatch(logout({ navigate }));

                return { user: {}, isAuthenticate: false };
            }
            // Handle other errors
            return rejectWithValue(error.message);
        }
    }
);


export const logout = createAsyncThunk('auth/logout', async ({ navigate }) => {
    localStorage.clear()

    if (navigate) {
        console.log('hvghvghhh');
        navigate('/auth/login')
    }
    return { user: {}, token: null, isAuthenticate: false }; // Return an empty object to reset user
});

export const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {},
        token: null,
        isAuthenticate: localStorage.getItem('authToken') ? true : false,
        loading: false,
        error: null,
        messsage: '',
        severity: ''

    },
    reducers: {
        updateUserData: (state, action) => {
            state.user = { ...state.user, ...action.payload }
        }
        // logout: async (state, action) => {
        //     await localStorage.removeItem('user')
        //     await localStorage.removeItem('authToken')
        //     // state.isAuthenticate = false
        //     state.user = {}
        //     state.token = null
        // },
        // fetchUserDetails: async (state, action) => {
        //     const user = JSON.parse(localStorage.getItem('user'))
        //     const token = localStorage.getItem('authToken')
        //     state.status = user?.id ? 'succeeded' : "failed"
        //     state.isAuthenticate = true
        //     state.user = user?.id && user
        //     state.token = token != null && token
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticate = action.payload.isAuthenticate
            })
            .addCase(login.pending, (state) => {
                state.status = 'failed';
                state.loading = false
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticate = action.payload.isAuthenticate
                state.loading = false
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false
                state.error = action.payload // Action payload is error message if rejected
            })
            .addCase(register.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token
                state.isAuthenticate = action.payload.isAuthenticate
                state.loading = false
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false
                state.error = action.payload; // Action payload is error message if rejected
            })
            .addCase(fetchUserDetails.pending, (state) => {

                state.status = 'loading';
                state.loading = true;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isAuthenticate = action.payload.isAuthenticate
                state.loading = false
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.isAuthenticate = false
                state.status = 'failed';
                state.loading = false
                state.error = action.payload; // Action payload is error message if rejected
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.loading = false
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false
                state.error = action.payload; // Action payload is error message if rejected
            })

    },
})

export const { updateUserData } = AuthSlice.actions
export default AuthSlice.reducer