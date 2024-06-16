import mongoose from 'mongoose'

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
    //
}, {timestamps: true}, // this will add createdAt and updatedAt fields)

)
// Create the model from the schema and export it
const User = mongoose.model('User', userSchema)

export default User