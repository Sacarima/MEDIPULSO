import { createSlice } from "@reduxjs/toolkit"
import axios from 'axios'


const initialState = {
    currentUser: null,
    error: null,
    isLoggedIn: false,
    loading: false,
}

// Create a slice for the user
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        signInStart: (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.isLoggedIn = true
            state.error = null
            localStorage.setItem("currentUser", JSON.stringify(action.payload)) // Save the user to the local storage or cookies if needed remove if not needed
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true
            state.error = null
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        updateFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        deleteUserStart: (state) => {
            state.loading = true
            state.error = null
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        logoutUserStart: (state) => {
            state.loading = true
        },
        logoutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.isLoggedIn = false;
            state.error = null;
            localStorage.removeItem("currentUser"); // Remove from localStorage on logout, remove if not needed
        },
        logoutUserFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        resetUserState: (state) => {
            state.currentUser = null
            state.error = null
            state.isLoggedIn = false
            state.loading = false
            localStorage.removeItem("currentUser") // Reset the user state and remove from localStorage
        }

    }
})

// Export the action creators
export const { 
    signInStart, 
    signInSuccess, 
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    logoutUserStart,
    logoutUserSuccess,
    logoutUserFailure,
    clearError,
    resetUserState
} = userSlice.actions


export const appleSignIn = (idToken) => async (dispatch) => {
    dispatch(signInStart())
    try {
        const response = await axios.post('http://localhost:7500/api/auth/apple', { id_token: idToken })
        dispatch(signInSuccess(response.data))

        // Save the user to the local storage or cookies if needed
        localStorage.setItem('token', response.data.token)
    } catch (error) {
        dispatch(signInFailure(error.message))
    }
}

export default userSlice.reducer