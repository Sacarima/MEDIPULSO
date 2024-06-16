import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    name: {
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
    specialty: {
        type: String,
        required: true,
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
    // add more fields as needed

    //
}, {timestamps: true}, // this will add createdAt and updatedAt fields)

)

// Create the model from the schema and export it
const Doctor = mongoose.model('Doctor', doctorSchema)

export default Doctor