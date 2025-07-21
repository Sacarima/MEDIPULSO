import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    loading: false,
    error: null,
    userType: null,
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
            state.error = null
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.isLoggedIn = true
            state.error = null
            state.userType = action.payload.userType
        },
        loginFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isLoggedIn = false
        },
        logout: (state) => {
            state.isLoggedIn = false
            state.userType = null
        },
    },
})

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    logout 
} = loginSlice.actions
export default loginSlice.reducer