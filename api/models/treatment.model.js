import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
        slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },
    images: [{
        type: String,
        default: [],
    }],
    priceRange: {
        type: String,
        default: "",
    },
    sections:[
        {
            title: String,
            content: String,
        },
    ],
    specialties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Specialty",
        },
    ],
    priceByCity: [{
        city: String,
        clinicsCount: Number,
        doctorsCount: Number,
        minPrice: Number
    }],
    sections: [
    {
        title: String,
        content: String,
        type: {
            type: String,
            enum: ['default', 'step', 'faq', 'benefit', 'risk', 'candidate'],
            default: 'default'
        }
    }
    ],


});

const Treatment = mongoose.model("Treatment", treatmentSchema);
export default Treatment;
