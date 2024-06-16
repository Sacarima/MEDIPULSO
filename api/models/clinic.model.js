import mongoose from "mongoose"

const clinicSchema = new mongoose.Schema({
    facilityName: {
        type: String,
        required: true,
    },
    employeeStrength: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    programUsed: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    name: {
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
    }
}, {timestamps: true},
)

// Create the model from the schema and export it
const Clinic = mongoose.model('Clinic', clinicSchema)

export default Clinic