import axios from "axios"
import { loginStart, loginSuccess, loginFailure } from "./loginSlice"

export const sharedLogin = (email, password, role) => async (dispatch) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
    dispatch(loginStart()); // Start login
    try {
        // Send login request to backend with the specified role
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password, role });

        // Dispatch login success and store the user role (doctor, patient, or clinic)
        dispatch(loginSuccess({ userType: response.data.role }));

        // Optionally store the token in localStorage
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        dispatch(loginFailure(error.response?.data?.message || error.message)); // Handle login failure
    }
}