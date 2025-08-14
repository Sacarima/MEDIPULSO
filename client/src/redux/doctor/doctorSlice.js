import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentDoctor: null,
    error: null,
    isLoggedIn: false,
    loading: false,
}

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        signInDoctorStart: (state) => {
            state.loading = true
        },
        signInDoctorSuccess: (state, action) => {
            
            state.currentDoctor = action.payload
            state.loading = false
            state.isLoggedIn = true
            state.error = null
        },
        signInDoctorFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateDoctorStart: (state, action) => {
            state.loading = true
        },
        updateDoctorSuccess: (state, action) => {
            state.currentDoctor = action.payload
            state.loading = false
            state.error = null
        },
        updateDoctorFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        deleteDoctorStart: (state) => {
            state.loading = true
        },
        deleteDoctorSuccess: (state) => {
            state.currentDoctor = null
            state.loading = false
            state.error = null
        },
        deleteDoctorFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        logoutDoctorStart: (state) => {
            state.loading = true
        },
        logoutDoctorSuccess: (state) => {
            state.currentDoctor = null
            state.loading = false
            state.error = null
            state.isLoggedIn = false
        },
        logoutDoctorFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        clearDoctorError: (state) => {
            state.error = null
        },
        resetDoctorState: (state) => {
            state.currentDoctor = null
            state.error = null
            state.isLoggedIn = false
            state.loading = false
            localStorage.removeItem("currentDoctor")
        }
    }
})

    export const {
        signInDoctorStart,
        signInDoctorSuccess,
        signInDoctorFailure,
        updateDoctorStart,
        updateDoctorSuccess,
        updateDoctorFailure,
        deleteDoctorStart,
        deleteDoctorSuccess,
        deleteDoctorFailure,
        logoutDoctorStart,
        logoutDoctorSuccess,
        logoutDoctorFailure,
        clearDoctorError,
        resetDoctorState,
    } = doctorSlice.actions




export default doctorSlice.reducer



