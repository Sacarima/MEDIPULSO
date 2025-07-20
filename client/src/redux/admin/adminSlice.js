import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentAdmin: null,
    error: null,
    isLoggedIn: false,
    loading: false,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        signInAdminStart: (state) => {
            state.loading = true
        },
        signInAdminSuccess: (state, action) => {
            state.currentAdmin = action.payload
            state.loading = false
            state.isLoggedIn = true
            state.error = null
        },
        signInAdminFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateAdminStart: (state) => {
            state.loading = true
        },
        updateAdminSuccess: (state, action) => {
            state.currentAdmin = action.payload
            state.loading = false
            state.error = null
        },
        updateAdminFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        deleteAdminStart: (state) => {
            state.loading = true
        },
        deleteAdminSuccess: (state) => {
            state.currentAdmin = null
            state.loading = false
            state.error = null
        },
        deleteAdminFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        logoutAdminStart: (state) => {
            state.loading = true
        },
        logoutAdminSuccess: (state) => {
            state.currentAdmin = null
            state.loading = false
            state.error = null
            state.isLoggedIn = false
        },
        logoutAdminFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        resetAdminState: (state) => {
            state.currentAdmin = null
            state.error = null
            state.isLoggedIn = false
            state.loading = false
            localStorage.removeItem("currentAdmin")
        }
    }
})
export const {
    signInAdminStart,
    signInAdminSuccess,
    signInAdminFailure,
    updateAdminStart,
    updateAdminSuccess,
    updateAdminFailure,
    deleteAdminStart,
    deleteAdminSuccess,
    deleteAdminFailure,
    logoutAdminStart,
    logoutAdminSuccess,
    logoutAdminFailure,
    resetAdminState,
} = adminSlice.actions


export default adminSlice.reducer
