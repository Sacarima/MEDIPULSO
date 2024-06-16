import { createSlice } from "@reduxjs/toolkit"


// Define the initial state of the user slice
const initialState = {
    currentUser: null,
    error: null,
    loading: false,

}

// Create a slice for the user
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
    }
})

// Export the action creators
export const { 
    signInStart, 
    signInSuccess, 
    signInFailure 
} = userSlice.actions

export default userSlice.reducer