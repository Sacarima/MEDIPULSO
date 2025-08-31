import mongoose from "mongoose"
import Appointment from "../models/appointment.model.js"
import DoctorAvailability from "../models/doctorAvailability.model.js"
import { errorHandler } from "../utils/error.js"
import DoctorForm from "../models/doctorForm.model.js"
import { normalizeTime } from "../utils/time.js" 



function emitAppointment(io, doctorId, payload, action) {
  if (!io || !doctorId) return;
  io.to(`doctor:${doctorId}`).emit('appointment:changed', {
    doctorId,
    action,   // 'created' | 'statusUpdated' | 'canceled' | 'rescheduled'
    ...payload,
  });
}


// Create a new appointment
// This function handles the creation of a new appointment.
// It checks the availability of the doctor, validates the input data, and saves the appointment to the database.
// If the appointment is successfully created, it returns a success message and the appointment details.
// If an error occurs during the process, it calls the next middleware with an error handler.
// It also includes validation for the doctor's availability on the selected date and time, and checks for overlapping appointments.
// The function expects the request body to contain the following fields: patient, doctor, date, time, reason, status, specialNotes, phoneNumber, dateOfBirth, and consent.
// The function also formats the phone number to a string and ensures that the date of birth is a valid date.
// The status of the appointment defaults to "pending" if not provided.
// The function also checks if the doctor and patient IDs are valid MongoDB ObjectIDs.
// It uses the DoctorAvailability model to check the doctor's availability and the Appointment model to check for overlapping appointments.
// If the doctor is not available on the selected day or time, it returns an error
export const createAppointment = async (req, res, next) => {
    const { 
        patient, 
        doctor, 
        date, 
        time, 
        reason, 
        status, 
        specialNotes,
        phoneNumber, 
        dateOfBirth,
        consent

    } = req.body

    try {

        // Validate input
        if (!patient || !doctor || !date || !time || !reason) {
            return next(errorHandler(400, "All fields are required"))
        }

        

        // Validate doctor ID format
        if (!mongoose.Types.ObjectId.isValid(doctor)) {
            return next(errorHandler(400, "Invalid doctor ID format"))
        }

        // validate patients ID format
        if (!mongoose.Types.ObjectId.isValid(patient)) {
            return next(errorHandler(400, "Invalid patient ID format"))
        }

        // Convert Date of birth to date object
        const parsedDateOfBirth = new Date(dateOfBirth)
        if (isNaN(parsedDateOfBirth.getTime())) {
            return next(errorHandler(400, "Invalid date format for dateOfBirth"));
        }

        // Format phone number to a string
        const formattedPhoneNumber = String(phoneNumber)

        // Ensure consent is a boolean
        const parsedConsent = Boolean(consent)

        // Check doctor availability
        const doctorAvailability = await DoctorAvailability.findOne({ doctor: new mongoose.Types.ObjectId(doctor) })

        if (!doctorAvailability) {
            return next(errorHandler(400, `Doctor with ID ${doctor} has no availability configured`))
        }


        // Check if the selected day is available
        const selectedDay = new Date(date).toLocaleString('en-us', { weekday: 'long' })
        if (!doctorAvailability.availableDays.includes(selectedDay)) {
            return next(errorHandler(400, `Doctor is not available on ${selectedDay}`))
        }

        // Check if the selected time is available
        if (!doctorAvailability.availableTimes.includes(time)) {
            return next(errorHandler(400, `Doctor is not available at ${time}`))
        }

        // Check for overlapping appointments
        const overlappingAppointment = await Appointment.findOne({ doctor, date, time })
        if (overlappingAppointment) {
            return next(errorHandler(400, "This time slot is already booked"))
        }

        // Create the appointment
        const newAppointment = new Appointment({
            patient,
            doctor,
            date,
            time,
            reason,
            status: status || "pending", // Default status to "pending" if not provided
            specialNotes,
            phoneNumber: formattedPhoneNumber, 
            dateOfBirth: parsedDateOfBirth,
            consent: parsedConsent,

        })

        const savedAppointment = await newAppointment.save()

        // Emit the appointment creation event
        const io = req.app.get('io');
        emitAppointment(io, doctor, { appointment: savedAppointment }, 'created');

        // Respond with the created appointment
        res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment: savedAppointment,
        })

    } catch (error) {
        console.error("Error in createAppointment:", error)
        return next(errorHandler(500, error.message))
    }
}


// Get appointments by doctor
// This function retrieves all appointments for a specific doctor.
// It first checks if the doctor ID is provided in the request parameters.
// If the doctor ID is not provided, it returns a 400 error.
// It then gets the current date and time, and updates any expired pending appointments to "canceled" status.
// It also updates any past confirmed appointments to "completed" status.
// Finally, it retrieves all appointments for the specified doctor and populates the patient details.
// If an error occurs during the process, it calls the next middleware with an error handler.
export const getAppointmentsByDoctor = async (req, res, next) => {
    const { doctorId } = req.params

    try {
        if (!doctorId) {
            return next(errorHandler(400, "Doctor ID is required"))
        }

        // Get current date and time
        const now = new Date();

        // Find and update expired pending appointments
        await Appointment.updateMany(
            {
                doctor: doctorId,
                status: "pending",
                date: { $lt: now.toISOString().split("T")[0] }, // Check past dates
            },
            { status: "canceled" }
        )

        // Update past confirmed appointments to "completed"
        await Appointment.updateMany(
            {
                doctor: doctorId,
                status: "confirmed",
                date: { $lt: now.toISOString().split("T")[0] }, // Check past dates
            },
            { status: "completed" }
        )

        const appointments = await Appointment.find({ doctor: doctorId }).populate('patient', 'firstName lastName email')
        
        res.status(200).json({
            success: true,
            appointments,
        })

    } catch (error) {
        return next(errorHandler(500, error.message))
    }
}

// Get appointments by user
// This function retrieves all appointments for a specific user (patient).
// It first checks if the user ID is provided in the request parameters.
// If the user ID is not provided, it returns a 400 error.
// It then retrieves all appointments for the specified user and populates the doctor details (first name and last name).
// If an error occurs during the process, it calls the next middleware with an error handler.
export const getAppointmentsByUser = async (req, res) => {
    const { userId } = req.params
  
    try {
      const appointments = await Appointment.find({ patient: userId }).populate('doctor', 'firstName lastName')
      res.status(200).json(appointments)
    } catch (error) {
      res.status(500).json({ message: 'Server error', error })
    }
  }

//Update appointment status
export const updateAppointmentStatus = async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    if (!appointmentId || !status) {
      return next(errorHandler(400, "Appointment ID and status are required"));
    }

    // Validate status against your schema enum
    const allowed = new Set(["pending", "confirmed", "canceled", "completed"]);
    if (!allowed.has(status)) {
      return next(errorHandler(400, `Invalid status "${status}". Allowed: pending, confirmed, canceled, completed`));
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) return next(errorHandler(404, "Appointment not found"));

    // Ensure only the owning doctor can change status
    if (String(appt.doctor) !== String(req.user?.id)) {
      return next(errorHandler(403, "Not allowed to update this appointment"));
    }

    const previousStatus = appt.status;

    // No-op if unchanged
    if (previousStatus === status) {
      return res.status(200).json({
        success: true,
        message: "Status unchanged",
        appointment: appt,
      });
    }

    // Update & save
    appt.status = status;
    await appt.save();

    // Realtime emit
    const io = req.app.get("io");
    if (io) {
      const action = status === "canceled" ? "canceled" : "statusUpdated";
      io.to(`doctor:${String(appt.doctor)}`).emit("appointment:changed", {
        doctorId: String(appt.doctor),
        action,
        appointment: appt,
        previousStatus,
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: appt,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};


// Reschedule appointment
// This function allows a user to reschedule an existing appointment.
// It checks if the appointment ID, new date, and new time are provided in the request body.
// It validates the new date and time, checks the doctor's availability, and ensures there are no overlapping appointments.
// If all checks pass, it updates the appointment with the new date and time.
// If an error occurs during the process, it calls the next middleware with an error handler.
// The function expects the request parameters to contain the appointment ID and the request body to contain the new date and time.
// It also checks if the new date and time are in the future, and if the doctor is available on the new date and time.
// If the appointment is successfully rescheduled,
// it returns a success message and the updated appointment details.


export const rescheduleAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;
  const { newDate, newTime } = req.body;

  try {
    // Validate input
    if (!appointmentId || !newDate || !newTime) {
      return next(errorHandler(400, "Appointment ID, new date, and new time are required"));
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(errorHandler(404, "Appointment not found"));
    }

    // Save previous slot BEFORE changing
    const prevDate = appointment.date;
    const prevTime = appointment.time;

    // Check if new date/time is in the future
    const newDateTime = new Date(`${newDate}T${newTime}:00`);
    if (newDateTime <= new Date()) {
      return next(errorHandler(400, "New appointment time must be in the future"));
    }

    // Check if doctor is available at the new date/time
    const doctorAvailability = await DoctorAvailability.findOne({ doctor: appointment.doctor });
    if (!doctorAvailability) {
      return next(errorHandler(400, "Doctor has no availability configured"));
    }

    const selectedDay = newDateTime.toLocaleString("en-us", { weekday: "long" });

    if (!doctorAvailability.availableDays.includes(selectedDay)) {
      return next(errorHandler(400, `Doctor is not available on ${selectedDay}`));
    }

    if (!doctorAvailability.availableTimes.includes(newTime)) {
      return next(errorHandler(400, `Doctor is not available at ${newTime}`));
    }

    // Check for overlapping appointments
    const overlappingAppointment = await Appointment.findOne({
      doctor: appointment.doctor,
      date: new Date(newDate), // ensure Date type
      time: newTime,
      _id: { $ne: appointment._id }, // exclude current one
    });

    if (overlappingAppointment) {
      return next(errorHandler(400, "This time slot is already booked"));
    }

    // Update the appointment
    appointment.date = newDate;
    appointment.time = newTime;
    await appointment.save();

    // Emit the appointment rescheduling event (include previous slot)
    const io = req.app.get('io');
    emitAppointment(
      io,
      appointment.doctor,
      {
        appointment,
        newDate,
        newTime,
        previousDate: prevDate,
        previousTime: prevTime,
      },
      'rescheduled'
    );

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error in rescheduling appointment:", error);
    return next(errorHandler(500, error.message));
  }
};


// Cancel appointment
// This function allows a user to cancel an existing appointment.
// It checks if the appointment ID is provided in the request parameters.
// If the appointment ID is not provided, it returns a 400 error.
// It then updates the appointment status to "canceled" instead of deleting it.
// This is to maintain the appointment history and avoid data loss.
// If the appointment is successfully canceled, it returns a success message and the updated appointment details.
// If an error occurs during the process, it calls the next middleware with an error handler.
export const cancelAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;
  const { reason } = req.body;

  try {
    if (!appointmentId) {
      return next(errorHandler(400, "Appointment ID is required"));
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) return next(errorHandler(404, "Appointment not found"));

    // Ensure user is allowed (doctor or patient linked to appt)
    if (
      String(appt.doctor) !== String(req.user.id) &&
      String(appt.user) !== String(req.user.id)
    ) {
      return next(errorHandler(403, "Not allowed to cancel this appointment"));
    }

    // Only cancel if not already completed/canceled
    if (appt.status === "completed") {
      return next(errorHandler(400, "Completed appointments cannot be canceled"));
    }
    if (appt.status === "canceled") {
      return next(errorHandler(400, "This appointment is already canceled"));
    }

    // Soft cancel
    appt.status = "canceled";
    appt.canceledAt = new Date();
    appt.canceledBy = req.user.role || "unknown"; // e.g., 'doctor' or 'patient'
    if (reason) appt.cancelReason = reason;

    await appt.save();

    // Emit socket event to free slot in real time
    const io = req.app.get("io");
    const apptDateStr = new Date(appt.date).toISOString().split("T")[0];
    emitAppointment(io, appt.doctor, {
      appointment: appt,
      date: apptDateStr,
      time: appt.time,
    }, "canceled");

    res.status(200).json({
      success: true,
      message: "Appointment canceled successfully",
      appointment: appt,
    });
  } catch (error) {
    console.error("Error in cancelAppointment:", error);
    return next(errorHandler(500, error.message));
  }
};



// Get appointment by date
// This function retrieves all appointments for a specific date.
// It expects the date to be provided as a query parameter in the format "YYYY-MM-DD".
// If the date is not provided, it returns a 400 error.
// It then searches for appointments that match the specified date and returns them in the response.
// If no appointments are found for the specified date, it returns a 404 error.
// If an error occurs during the process, it calls the next middleware with an error handler.
export const getAppointmentsByDate = async (req, res, next) => {
    const { date } = req.query;

    try {
        if (!date) {
            return next(errorHandler(400, "Date query parameter is required"));
        }

        const appointments = await Appointment.find({ date });
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No appointments found for date ${date}.`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Appointments for ${date} retrieved successfully.`,
            appointments: appointments || [],
        });
    } catch (error) {
        console.error("Error in getAppointmentsByDate:", error);
        next(errorHandler(500, error.message));
    }
};


// Get appointment by week
// This function retrieves all appointments for a specific doctor within a specified week. 
// It expects the doctor ID to be provided in the request parameters and the start date of the week as a query parameter.

export const getAppointmentsByWeek = async (req, res, next) => {
    const { doctorId } = req.params
    const { startDate } = req.query


    try {
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return next(errorHandler(400, "Invalid doctor ID format"))
        }

        if (!startDate) {
            return next(errorHandler(400, "startDate query parameter is required"))
        }

        const start = new Date(startDate)
        const end = new Date(start)
        end.setDate(start.getDate() + 6) // Add 6 days to get the end of the week

        const appointments = await Appointment.find({
            doctor: doctorId,
            date: { 
                $gte: start.toISOString().split('T')[0],
                $lte: end.toISOString().split('T')[0], 
            }
        })

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully for the specified week',
            appointments,
        })
    } catch (error) {
        console.error("Error in getAppointmentsByWeek:", error)
        return next(errorHandler(500, error.message))
    }
}

// Get appointment by month
export const getAppointmentsByMonth = async (req, res, next) => {
    const { doctorId } = req.params
    const { month, year } = req.query

    try {
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            console.error("Invalid doctor ID:", doctorId);
            return next(errorHandler(400, "Invalid doctor ID format"));
        }        

        if (!month || !year) {
            return next(errorHandler(400, "month and year query parameters are required"))
        }

        const start = new Date(`${year}-${month}-01`);
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1); // Move to the next month
        end.setDate(0); // Set to the last day of the current month

        const appointments = await Appointment.find({
            doctor: doctorId,
            date: {
                $gte: start.toISOString().split('T')[0],
                $lte: end.toISOString().split('T')[0],
            },
        })

        res.status(200).json({
            success: true,
            message: 'Appointments retrieved successfully for the specified month',
            appointments,
        })
    } catch (error) {
        console.error("Error in getAppointmentsByMonth:", error)
        return next(errorHandler(500, error.message))
    }
}


// Create monthly availability for a doctor
// This function allows a doctor to create their availability for a specific month and year.
// It expects the doctor ID, month, year, and available times to be provided in the request body.
// It validates the doctor ID format, prepares the dates for the month, and checks if the doctor already has availability configured.
// If no availability exists, it creates a new one with the provided available times.
// If availability exists, it checks for conflicts and updates the available times accordingly.
// The function returns a success message upon successful creation or update of the monthly availability.
export const createMonthlyAvailability = async (req, res, next) => {
    const { doctorId, month, year, availableTimes } = req.body;

    try {
        // Validate doctorId
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return next(errorHandler(400, "Invalid doctor ID format"));
        }

        // Prepare monthly availability dates
        const dates = [];
        const startOfMonth = new Date(year, month - 1, 1);
        const daysInMonth = new Date(year, month, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month - 1, day);
            const dayOfWeek = currentDay.toLocaleString("en-us", { weekday: "long" });

            // Include only weekdays
            if (!["Saturday", "Sunday"].includes(dayOfWeek)) {
                dates.push({ date: currentDay, times: availableTimes });
            }
        }

        // Check if availability exists for the doctor
        const existingAvailability = await DoctorAvailability.findOne({ doctor: doctorId });
        if (!existingAvailability) {
            // If no availability exists, create a new one
            const newAvailability = new DoctorAvailability({
                doctor: doctorId,
                availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                availableTimes,
            });
            await newAvailability.save();
        } else {
            // If availability exists, check for conflicts and update
            const updatedTimes = [...new Set([...existingAvailability.availableTimes, ...availableTimes])];
            await DoctorAvailability.findOneAndUpdate(
                { doctor: doctorId },
                { availableTimes: updatedTimes },
                { new: true }
            );
        }

        res.status(201).json({
            success: true,
            message: `Monthly availability for ${month}/${year} created successfully.`,
        });
    } catch (error) {
        console.error("Error in createMonthlyAvailability:", error);
        next(errorHandler(500, error.message));
    }
}

// Fetch the next upcoming appointment for the logged-in user
// This function retrieves the next upcoming appointment for the logged-in user.
// It checks if the user is authenticated, finds the next appointment scheduled for the future,
// and returns the appointment details along with the doctor's information.     
export const getUpcomingAppointment = async (req, res, next) => {
    try {
        const userId = req.user.id

        //Find the next upcoming appointment that is scheduledf for the future
        const upcomingAppointment = await Appointment.findOne({
            patient: userId,
            date: { $gte: new Date().toISOString().split('T')[0] },
            status: {$in: ['pending', 'confirmed']},
        })
        .sort({ date: 1, time: 1 }) 
        .populate('doctor', 'firstName lastName medicalSpecialtyCategory address profilePicture medicalCategory')

        if (!upcomingAppointment) {
            return res.status(404).json({
                success: false,
                message: "You have no upcoming appointments",
            })
        }

        res.status(200).json({
            success: true,
            message: "Upcoming appointment retrieved successfully",
            appointment: upcomingAppointment,
        })
    } catch (error) {
        console.error("Error fetching upcoming appointment:", error)
        return next(errorHandler(500, "Failed to retrieve upcoming appointment."))
    }
}

    // fetch next upcoming appointment for doctor
    export const getUpcomingAppointmentForDoctor = async (req, res, next) => {
        try {
            const doctorId = req.user.id
            const upcomingAppointment = await Appointment.findOne({
                doctor: doctorId,
                date: { $gte: new Date().toISOString().split('T')[0] },
                status: 'confirmed',
            })
            .sort({ date: 1, time: 1 })
            .populate('patient', 'firstName lastName email')

            if (!upcomingAppointment) {
                return res.status(404).json({
                    success: false,
                    message: "No upcoming appointments found",
                })
            }

            res.status(200).json({
                success: true,
                message: "Upcoming appointment retrieved successfully",
                appointment: upcomingAppointment,
            })
        } catch (error) {
            console.error("Error fetching upcoming appointment:", error)
            return next(errorHandler(500, "Failed to retrieve upcoming appointment."))
        }
    }



// Public: return booked slots (pending/confirmed) by doctor from today forward
export const getBookedSlotsPublic = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return next(errorHandler(400, "Invalid doctor ID format"));
    }

    // start of today (local server time)
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // fetch only what's needed
    const appts = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfToday },
      status: { $in: ["pending", "confirmed"] },
    }).select("date time -_id");

    // build { 'YYYY-MM-DD': ['HH:mm', ...] }
    const booked = {};
    for (const a of appts) {
      const day = new Date(a.date).toISOString().split("T")[0];
      const t = normalizeTime(a.time);
      if (!booked[day]) booked[day] = [];
      booked[day].push(t);
    }
    // dedupe + sort
    Object.keys(booked).forEach((day) => {
      booked[day] = [...new Set(booked[day])].sort((a, b) => a.localeCompare(b));
    });

    res.json({ success: true, booked });
  } catch (err) {
    console.error("getBookedSlotsPublic error:", err);
    next(errorHandler(500, "Failed to fetch booked slots"));
  }
};


// ADMIN: hard delete an appointment
export const adminHardDeleteAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return next(errorHandler(400, 'Invalid appointment ID format'));
    }

    const appt = await Appointment.findById(appointmentId);
    if (!appt) return next(errorHandler(404, 'Appointment not found'));

    const doctorId = String(appt.doctor);
    const date = appt.date;
    const time = appt.time;

    await Appointment.findByIdAndDelete(appointmentId);

    // notify doctor dashboards if you want (re-use your existing emitter shape)
    const io = req.app.get('io');
    if (io) {
      io.to(`doctor:${doctorId}`).emit('appointment:changed', {
        doctorId,
        action: 'canceled',      // you don't have a 'deleted' action; reuse 'canceled'
        appointmentId,
        date,
        time,
        deletedBy: 'admin',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted',
      appointmentId,
    });
  } catch (err) {
    console.error('adminHardDeleteAppointment error:', err);
    next(errorHandler(500, 'Failed to delete appointment'));
  }
};



// Test API
export const test = (req, res) => {
    res.json({message: 'API is working'})

}

