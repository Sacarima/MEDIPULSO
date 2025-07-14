import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorForm',
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

const Review = mongoose.model('Review', reviewSchema)
export default Review