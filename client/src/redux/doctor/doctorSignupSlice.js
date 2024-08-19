import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    firstName: '',
    lastName: '',
    medicalCategory: '',
    city: '',
    countryCode: '',
    phoneNumber: '',
    email: '',
    password: '',
    termsConditions: false,
    profileStatistics: false,

}

const doctorSignupSlice = createSlice ({
    name: 'doctorSignup',
    initialState,
    reducers: {
        updateSignupData: (state, action) => {
            return {...state, ...action.payload}
    },
    resetSignupData: () => initialState,
}
})

export const { updateSignupData } = doctorSignupSlice.actions
export default doctorSignupSlice.reducer

