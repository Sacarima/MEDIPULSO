import mongoose from 'mongoose'

// Define the user schema
const userSchema = new mongoose.Schema({
    // 
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }, 
    consentToMarketing: {
        type: Boolean,
        default: false,
      },
    termsConditions: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    avatar:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    
}, {timestamps: true}, // this will add createdAt and updatedAt fields) in the database

)
// Create the model from the schema and export it
const User = mongoose.model('User', userSchema)

export default User