import mongoose from "mongoose"

const doctorFormSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    
    medicalCategory: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
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

    selectAll: {
        type: Boolean, 
        required: false,
    }

    // add more fields as needed

}, {timestamps: true}) // this will add createdAt and updatedAt fields))

// Create the model from the schema and export it
const DoctorForm = mongoose.model('DoctorForm', doctorFormSchema)

export default DoctorForm