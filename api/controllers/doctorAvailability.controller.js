import DoctorAvailability from "../models/doctorAvailability.model.js"
import { errorHandler } from "../utils/error.js"
import mongoose from "mongoose"


function emitAvailability(io, doctorId, availability, action = 'updated', meta = {}) {
  if (!io || !doctorId) return;
  io.to(`doctor:${doctorId}`).emit('availability:changed', {
    doctorId,
    action,           // 'created' | 'updated' | 'removed' | 'deleted'
    availability,     // full doc or null (if deleted)
    ...meta,          // e.g., { month, year, date, time }
  });
}


export const test = (req, res) => {
    res.json({message: 'API is working'})

}

export const addDoctorAvailability = async (req, res, next) => {
    const { doctor, availableDays, availableTimes } = req.body

    try {
        //check if doctor availability already exists
        const existingAvailability = await DoctorAvailability.findOne({ doctor })
        if (existingAvailability) {
            return next(errorHandler(400, "Doctor availability already exists"))
        }

        const newDoctorAvailability = new DoctorAvailability({
            doctor,
            availableDays,
            availableTimes
        })

        const savedAvailability = await newDoctorAvailability.save()
        // realtime
        const io = req.app.get('io');
        emitAvailability(io, doctor, savedAvailability, 'created');

        res.status(201).json({
            success: true,
            message: "Doctor availability added successfully",
            availability: savedAvailability,
          })
    } catch (error) {
        console.error("Error in addDoctorAvailability:", error)
        next(errorHandler(500, error.message))
    }
}

// Get all available days and times for a doctor
export const  getDoctorAvailability = async (req, res, next) => {
    const { doctorId } = req.params

    try {
        if ( !mongoose.Types.ObjectId.isValid(doctorId)) {
            return next(errorHandler(400, "Invalid doctor ID format"))
        }

        // query the database for the doctor availability
        const availability = await DoctorAvailability.findOne({ doctor: doctorId })

        if (!availability) {
            return next(errorHandler(404, `No availability found for doctor ID ${doctorId}.`))
          }      

          res.status(200).json({
            success: true,
            message: 'Doctor availability retrieved successfully.',
            availability,
          })
    } catch (error) {
        console.error("Error in getDoctorAvailability:", error)
        next(errorHandler(500, error.message))
    }
}

// Get availability for a specific date
export const getDoctorAvailabilityByDate = async (req, res, next) => {
    const { doctorId, date } = req.params

    try {

        const availability = await DoctorAvailability.findOne({ doctor: doctorId })

        if (!availability) {
            return next(errorHandler(404, `No availability found for doctor ID ${doctorId}.`))
        }

        const selectedDay = new Date(date).toLocaleString('en-us', { weekday: 'long' })

        if (!availability.availableDays.includes(selectedDay)) {
          return next(errorHandler(400, `Doctor is not available on ${selectedDay}.`))
        }
    
        res.status(200).json({
          success: true,
          message: `Doctor is available on ${selectedDay}.`,
          availableTimes: availability.availableTimes,
        })
    } catch (error) {
        console.error("Error in getDoctorAvailabilityByDate:", error)
        next(errorHandler(500, error.message))
    }
}



// Update doctor availability
export const updateDoctorAvailability = async (req, res, next) => {
  const { doctorId } = req.params;
  const { availableDays, availableTimes, month, year, monthlyDates, removeDate, removeTime } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return next(errorHandler(400, "Invalid doctor ID format"));
    }

    // Try to find doctor's availability
    let doctorAvailability = await DoctorAvailability.findOne({ doctor: doctorId });

    // If no availability document exists, create one
    if (!doctorAvailability) {
      console.warn("No availability document found. Creating a new one...");
      doctorAvailability = new DoctorAvailability({
        doctor: doctorId,
        monthlyAvailability: [],
      });
    }

    // Handle removal of specific date or time
    if (removeDate) {
      doctorAvailability.monthlyAvailability.forEach((entry) => {
        if (entry.month === month && entry.year === year) {
          entry.dates.forEach((day) => {
            if (day.date.toISOString().split("T")[0] === removeDate) {
              if (removeTime) {
                day.times = day.times.filter((t) => t !== removeTime); // Remove specific time
              }
              if (day.times.length === 0) {
                entry.dates = entry.dates.filter((d) => d.date.toISOString().split("T")[0] !== removeDate); // Remove the entire day if no times remain
              }
            }
          });
        }
      });

      await doctorAvailability.save();

      const io = req.app.get('io');
      emitAvailability(io, doctorId, doctorAvailability, 'removed', { month, year, removeDate, removeTime }); 
      return res.status(200).json({ success: true, message: "Availability removed successfully." });
    }

    // If updating availability, check if month/year entry exists
    let existingMonth = doctorAvailability.monthlyAvailability.find(
      (entry) => entry.month === month && entry.year === year
    );

    if (!existingMonth) {
      console.warn("No existing month found, creating new month entry...");
      existingMonth = {
        month,
        year,
        dates: [],
      };
      doctorAvailability.monthlyAvailability.push(existingMonth);
    }

    //Add or update the availability for the given date
    monthlyDates.forEach(({ date, times }) => {
      let existingDate = existingMonth.dates.find((d) => d.date.toISOString().split("T")[0] === date);

      if (existingDate) {
        existingDate.times = [...new Set([...existingDate.times, ...times])]; 
      } else {
        existingMonth.dates.push({ date: new Date(date), times });
      }
    });

    const updatedAvailability = await doctorAvailability.save();

    // Emit the updated availability to the socket
    const io = req.app.get('io');
    emitAvailability(io, doctorId, updatedAvailability, 'updated', { month, year, dates: monthlyDates });

    res.status(200).json({
      success: true,
      message: "Doctor availability updated successfully.",
      availability: updatedAvailability,
    });
  } catch (error) {
    console.error("Error in updateDoctorAvailability:", error);
    next(errorHandler(500, error.message));
  }
};



  

//Delete doctor availability
export const deleteDoctorAvailability = async (req, res, next) => {
    const { doctorId }= req.params

    try {

        const deletedAvailability = await DoctorAvailability.findOneAndDelete({ doctor: doctorId })

        // realtime
        const io = req.app.get('io');
        emitAvailability(io, doctorId, null, 'deleted');

        if (!deletedAvailability) {
            return next(errorHandler(404, `No availability found for doctor ID ${doctorId}.`))
        }

        res.status(200).json({
            success: true,
            message: 'Doctor availability deleted successfully.',
            availability: deletedAvailability,
          })
    } catch (error) {
        console.error("Error in deleteDoctorAvailability:", error)
        next(errorHandler(500, error.message))
    }
}

// Create monthly availability for a doctor
export const createMonthlyAvailability = async (req, res, next) => {
    const { doctorId, month, year, availableTimes } = req.body

    try {

        if (!doctorId || !month || !year) {
            return next(errorHandler(400, "doctorId, month, and year are required"));
          }
      
      // Validate doctorId
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return next(errorHandler(400, "Invalid doctor ID format"));
      }
  
      // Retrieve doctor's existing availability
      const doctorAvailability = await DoctorAvailability.findOne({
        doctor: doctorId,
      })

      if (!Array.isArray(doctorAvailability.monthlyAvailability)) {
        doctorAvailability.monthlyAvailability = [];
      }
  
  
      // Check for existing monthly availability
      const existingMonth = doctorAvailability.monthlyAvailability.find(
        (entry) => entry.month === month && entry.year === year
      );
  
      if (existingMonth) {
        console.warn("Doctor availability already exists for this month/year.");
        return next(errorHandler(400, "Doctor availability already exists. Please update it."));
      }
  
      // Generate availability for the month
      const startOfMonth = new Date(year, month - 1, 1);
      const daysInMonth = new Date(year, month, 0).getDate()

      console.log("Generating availability for:", { month, year })
      const dates = [];
  
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(year, month - 1, day);
        const dayOfWeek = currentDay.toLocaleString("en-us", { weekday: "long" });
  
        if (!["Saturday", "Sunday"].includes(dayOfWeek) && availableTimes?.length > 0) {
          dates.push({ date: currentDay, times: availableTimes });
        }
      }
  
  
      // Push new monthly availability
      doctorAvailability.monthlyAvailability.push({
        month,
        year,
        dates,
      });
  
      const updatedAvailability = await doctorAvailability.save()

      const io = req.app.get('io');
      emitAvailability(io, doctorId, updatedAvailability, 'updated', { month, year });
  
      const addedEntry = updatedAvailability.monthlyAvailability.find(
        (entry) => entry.month === month && entry.year === year
      )

    res.status(201).json({
      success: true,
      message: `Monthly availability for ${month}/${year} created successfully.`,
      availability: addedEntry,
    })
    } catch (error) {
      console.error("Error in createMonthlyAvailability:", error);
      next(errorHandler(500, error.message));
    }
  };


  export const getDoctorsByAvailability = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            return next(errorHandler(400, "Please provide a date to filter by."));
        }

        // Find all doctors available on the specified date
        const availableDoctors = await DoctorAvailability.find({
            "monthlyAvailability.dates.date": new Date(date)
        }).populate("doctor", "firstName lastName medicalCategory city profilePicture");

        if (!availableDoctors.length) {
            return res.status(404).json({ success: false, message: "No doctors found with the selected availability." });
        }

        res.status(200).json({ success: true, doctors: availableDoctors });
    } catch (error) {
        console.error("Error fetching doctors by availability:", error);
        next(errorHandler(500, "Failed to fetch available doctors."));
    }
};

