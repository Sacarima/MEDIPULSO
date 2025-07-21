import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentClinic: null,
    error: null,
    isLoggedIn: false,
    loading: false,
}

const clinicSlice = createSlice({
    name: 'clinic',
    initialState,
    reducers: {
        signInClinicStart: (state) => {
        state.loading = true;
        },
        signInClinicSuccess: (state, action) => {
        state.currentClinic = action.payload;
        state.loading = false;
        state.isLoggedIn = true;
        state.error = null;
        },
        signInClinicFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        },
        updateClinicStart: (state) => {
        state.loading = true;
        },
        updateClinicSuccess: (state, action) => {
        state.currentClinic = action.payload;
        state.loading = false;
        state.error = null;
        },
        updateClinicFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        },
        deleteClinicStart: (state) => {
        state.loading = true;
        },
        deleteClinicSuccess: (state) => {
        state.currentClinic = null;
        state.loading = false;
        state.error = null;
        },
        deleteClinicFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        },
        logoutClinicStart: (state) => {
        state.loading = true;
        },
        logoutClinicSuccess: (state) => {
        state.currentClinic = null;
        state.loading = false;
        state.error = null;
        state.isLoggedIn = false;
        },
        logoutClinicFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        },
        resetClinicState: (state) => {
        state.currentClinic = null;
        state.error = null;
        state.isLoggedIn = false;
        state.loading = false;
        localStorage.removeItem("currentClinic")
        }
    },
    });

export const {
    signInClinicStart,
    signInClinicSuccess,
    signInClinicFailure,
    updateClinicStart,
    updateClinicSuccess,
    updateClinicFailure,
    deleteClinicStart,
    deleteClinicSuccess,
    deleteClinicFailure,
    logoutClinicStart,
    logoutClinicSuccess,
    logoutClinicFailure,
    resetClinicState,
} = clinicSlice.actions;



export default clinicSlice.reducer