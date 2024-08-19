import { createSlice } from "@reduxjs/toolkit"
import axios from 'axios'


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