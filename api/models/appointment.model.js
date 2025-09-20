import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorForm", 
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    consent: {
        type: Boolean,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "canceled", "completed"],
        default: "pending",
    },
    specialNotes: {
        type: String,
        required: false,
        default: "",
    },
    reminderVersion: { 
        type: Number, default: 0 
    },
    canceledAt: Date,
    canceledBy: { type: String, enum: ["doctor","patient","admin","system"], default: undefined },
    cancelReason: String,

    //audit/context
    rescheduledFrom: { date: Date, time: String },
    rescheduledTo:   { date: Date, time: String },
},{timestamp: true})

const Appointment = mongoose.model("Appointment", appointmentSchema)

export default Appointment