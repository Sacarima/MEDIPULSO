import mongoose from "mongoose"

const doctorAvailabilitySchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorForm',
        required: true,
    },
    availableDays: {
        type: [String], 
        required: true,
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    availableTimes: {
        type: [String],
        required: true,
        default: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
    }, 

    monthlyAvailability: [
        {
          month: { type: Number, required: true }, // 1 for January, 2 for February, etc.
          year: { type: Number, required: true },
          dates: [
            {
              date: { type: Date, required: true },
              times: [String], // Available times for this specific day
            },
          ],
        },
      ],
}, {timestamps: true}) 

const DoctorAvailability = mongoose.model('DoctorAvailability', doctorAvailabilitySchema)

export default DoctorAvailability

    