import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
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
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
 
    experience: {
        type: String,
        required: true,
    },
    location: {
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
    // add more fields as needed

    //
}, {timestamps: true}, // this will add createdAt and updatedAt fields)

)

// Create the model from the schema and export it
const Doctor = mongoose.model('Doctor', doctorSchema)

export default Doctor