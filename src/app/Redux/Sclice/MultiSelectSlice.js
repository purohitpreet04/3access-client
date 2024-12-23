import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from 'Constance';
import { setIsLoading } from './manageStateSclice';



export const addSelectedValue = createAsyncThunk(
    'sideselect/addSelectedValue',
    async (value, { rejectWithValue, dispatch }) => {
        try {
            const { data, navigate, _id } = value
            // dispatch(setIsLoading({ data: true }));
            const sendData = data.toString()
            const res = await API.post('/api/user/addcompanies', { ids: sendData, _id })
            return { comp: res.data.ids }
        } catch (error) {
            dispatch(setIsLoading({ data: false }));
            dispatch(showSnackbar({ message: error.response.data.message, severity: error.response.data.severity }))
            return { comp: [] }
            // return rejectWithValue(error.message);
        }
    }
);



const sideselectSlice = createSlice({
    name: 'sideselect',
    initialState: {
        data: [],
        selectedValues: [],
        comData: [],
        propertydata: {}
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setSelectedData: (state, action) => {
            const selectedIds = new Set(action.payload?.data.split(','))
            const comdata = JSON.parse(JSON.stringify(state.data))
            state.selectedValues = comdata.filter((item) => selectedIds.has(item?._id));
        },
        removeSelectedValue: (state, action) => {
            state.selectedValues = state.selectedValues.filter(value => value._id !== action.payload?._id);
        },
        setComData: (state, action) => {
            state.comData = [...action.payload];
        },
        setPropertyData: (state, action) => {
            state.propertydata = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSelectedValue.fulfilled, (state, action) => {
                // console.log(action.payload.comp)
                const selectedIds = new Set(action.payload.comp.split(','))
                const comdata = JSON.parse(JSON.stringify(state.data))
                state.selectedValues = comdata.filter((item) => selectedIds.has(item?._id));
                // const data = comdata.filter((item) => selectedIds.has(item?._id));
                // console.log(data)
            })
            .addCase(addSelectedValue.rejected, (state, action) => {
                console.log(action.payload)
            })
    }

});

export const { setData, removeSelectedValue, setComData, setPropertyData, setSelectedData } = sideselectSlice.actions;
export default sideselectSlice.reducer;