import { TrendingUp } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";




export const manageStateSlice = createSlice({
    name: 'utils',
    initialState: {
        isOpen: false,
        openVaccine: false,
        isloading: false,
        openTreat: false,
        openLogs: false
    },
    reducers: {
        openAddPet: (state, action) => {
            state.isOpen = true
        },
        openAddVac: (state, action) => {
            state.openVaccine = true
        },
        closeModal: (state, action) => {
            state.isOpen = false
        },
        setIsLoading: (state, action) => {
            state.isloading = action.payload.data
        },
        openVaccModal: (state, action) => {
            state.openVaccine = true
        },
        closeVaccModal: (state, action) => {
            state.openVaccine = false
        },
        openTreatModal: (state, action) => {
            state.openTreat = true
        },
        closeTreatModal: (state, action) => {
            state.openTreat = false
        },
        handleLogs: (state, action) => {
            state.openLogs = action.payload;
        }


    }
})



export const { openAddPet, closeModal, setIsLoading, closeVaccModal, openVaccModal, closeTreatModal, openTreatModal, handleLogs } = manageStateSlice.actions
export default manageStateSlice.reducer