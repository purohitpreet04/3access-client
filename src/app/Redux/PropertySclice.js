import { fetchProperties } from "@app/API/Property";
import { createSlice } from "@reduxjs/toolkit";

// Property Slice
const propertySlice = createSlice({
    name: 'property',
    initialState: {
        properties: [],
        restData: {},
        totalCount: 0,
        loading: false,
        error: null,
        message: null
    },
    reducers: {
        clearPropertyError: (state) => {
            state.error = null;
        },
        clearPropertyMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                const { result, ...PageData } = action.payload
                state.loading = false;
                state.properties = result;
                state.restData = PageData;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch properties';
            });
    }
});

export const { clearPropertyError, clearPropertyMessage } = propertySlice.actions;
export default propertySlice.reducer;