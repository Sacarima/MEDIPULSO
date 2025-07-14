import mongoose from "mongoose"

const specialtySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    treatments: {
        type: [String],
        required: true,
    },

    doctors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DoctorForm',
        }
    ]
})

const Specialty = mongoose.model('Specialty', specialtySchema)
export default Specialty