import mongoose from "mongoose"


const clinicSchema = new mongoose.Schema({
    facilityName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    facilityPrograms: {
        type: String,
        required: true,
    },
    roleInFacility: {
        type: String,
        required: true,
    },
    numberOfDoctorsSpecialist: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },
    termsConditions: {
        type: Boolean,
        required: false,
    },
    profileStatistcs: {
        type: Boolean,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'doctor', 'clinic'],
        default: 'clinic',
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },

}, {timestamps: true},
)

// Create the model from the schema and export it
const Clinic = mongoose.model('Clinic', clinicSchema)

export default Clinic