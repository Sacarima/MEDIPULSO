import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    specialties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Specialty",
        },
    ],
});

const Treatment = mongoose.model("Treatment", treatmentSchema);
export default Treatment;
