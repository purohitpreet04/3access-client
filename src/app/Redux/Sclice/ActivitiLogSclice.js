import { fetchActivityLogs } from "@app/API/ActivityLogs";
import { createSlice } from "@reduxjs/toolkit";



const ActivitySclice = createSlice({
    name: 'activitylog',
    initialState: { logs: {}, status: '', isLoading: false, },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityLogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.logs = action.payload;
                state.isLoading = false
            })
            .addCase(fetchActivityLogs.pending, (state) => {
                state.status = 'pending';
                state.isLoading = true
            })
            .addCase(fetchActivityLogs.rejected, (state, action) => {
                state.status = 'failed';
                state.logs = []
                state.isLoading = false
            })
    }
})

export default ActivitySclice.reducer;