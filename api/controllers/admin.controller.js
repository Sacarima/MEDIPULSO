import Admin from "../models/admin.model.js"
import User from "../models/user.model.js"
import DoctorForm from "../models/doctorForm.model.js"
import Clinic from "../models/clinic.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Appointment from "../models/appointment.model.js"
import { errorHandler } from "../utils/error.js"
import Treatment from "../models/treatment.model.js"

// Admin login
// This function handles the login of an admin user
// It checks the provided email and password, and if they are valid, it generates a JWT
// token and sends it back to the client as a cookie.
// If the email or password is incorrect, it returns an error message.
// If the admin does not exist, it returns a 404 error.
export const loginAdmin = async (req, res, next) => {
    const { email, password } = req.body
    
    try {
        const admin = await Admin.findOne({ email })
        if (!admin) return next(errorHandler(404, "Admin not found"))
            
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) return next(errorHandler(401, "Invalid credentials"))

        const token = jwt.sign(
            { id: admin._id, role: admin.role }, 
            process.env.JWT_SECRET_TOKEN, 
            { expiresIn: "7d" }
        )

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })

        res.status(200).json({ success: true, message: "Admin logged in successfully" })
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

// Get All Users
// This function retrieves all users from the database, excluding their passwords for security reasons.
// It returns a list of users in JSON format.
// If an error occurs during the retrieval, it calls the next middleware with an error handler. 
export const getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find().select("-password")
      res.status(200).json(users)
    } catch (error) {
      next(errorHandler(500, error.message))
    }
  }

  // Delete a User
// This function deletes a user from the database based on the userId provided in the request parameters.
// It uses the User model to find and delete the user by their ID.
// If the deletion is successful, it returns a success message.
// If an error occurs during the deletion, it calls the next middleware with an error handler.
export const deleteUser = async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.userId)
      res.status(200).json({ success: true, message: "User deleted successfully" })
    } catch (error) {
      next(errorHandler(500, error.message))
    }
  }

  // Delete a Doctor
// This function deletes a doctor from the database based on the doctorId provided in the request parameters.
// It uses the Doctor model to find and delete the doctor by their ID.
// If the deletion is successful, it returns a success message.
// If an error occurs during the deletion, it calls the next middleware with an error handler.
export const deleteDoctor = async (req, res, next) => {
    try {
      await Doctor.findByIdAndDelete(req.params.doctorId)
      res.status(200).json({ success: true, message: "Doctor deleted successfully" })
    } catch (error) {
      next(errorHandler(500, error.message))
    }
  }

// Delete a Clinic
// This function deletes a clinic from the database based on the clinicId provided in the request parameters.
// It uses the Clinic model to find and delete the clinic by its ID.
// If the deletion is successful, it returns a success message.
// If an error occurs during the deletion, it calls the next middleware with an error handler.
export const deleteClinic = async (req, res, next) => {
    try {
      await Clinic.findByIdAndDelete(req.params.clinicId)
      res.status(200).json({ success: true, message: "Clinic deleted successfully" })
    } catch (error) {
      next(errorHandler(500, error.message))
    }
  }

    // Get all Doctors
// This function retrieves all doctors from the database, excluding their passwords for security reasons.
// It uses the DoctorForm model to find all doctors and returns them in JSON format.
// If an error occurs during the retrieval, it calls the next middleware with an error handler.
export const getAllDoctors = async (req, res, next) => {
    try {
      const doctors = await DoctorForm.find().select("-password")
      res.status(200).json(doctors)
    } catch (error) {
      next(errorHandler(500, error.message))
    }
  }

// Get all Clinics
// This function retrieves all clinics from the database.
// It uses the Clinic model to find all clinics and returns them in JSON format.
// If an error occurs during the retrieval, it calls the next middleware with an error handler.
export const getAllClinics = async (req, res, next) => {
    try {
      const clinics = await Clinic.find()
      res.status(200).json(clinics)
    } catch (error) {
      next(errorHandler(500, error.message))
    }
  }
  
// Get all Appointments
// This function retrieves all appointments from the database.
// It uses the Appointment model to find all appointments and returns them in JSON format.
// If an error occurs during the retrieval, it calls the next middleware with an error handler.
export const getAllAppointments = async (req, res, next) => {
    try {
      const appointments = await appointments.find()
      res.status(200).json(appointments)
    } catch (error) {
      next(errorHandler(500, error.message))
    }
  }

  // Create Admin
// This function creates a new admin user.
// It checks if an admin already exists in the database, and if not, it creates a new admin with the provided first name, last name, email, and password.
// If an admin already exists, it returns a 403 error.
// If the admin is created successfully, it returns a success message.
// If an error occurs during the creation, it calls the next middleware with an error handler.
  export const createAdmin = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body

        // 🚨 Prevent multiple admins (Only allow the first one)
        const existingAdmins = await Admin.find();
        if (existingAdmins.length > 0) {
            return next(errorHandler(403, "Admin already exists"));
        }

        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) return next(errorHandler(400, "Admin already exists"))

        // Create a new admin
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password,
        })

        await newAdmin.save()

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}


// Admin logout
// This function handles the logout of an admin user.
// It clears the access token cookie and returns a success message.
// If an error occurs during the logout process, it calls the next middleware with an error handler
export const logoutAdmin = async (req, res, next) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Admin logged out successfully",
        });
    } catch (error) {
        next(errorHandler(500, "Logout failed. Please try again."));
    }
}



// Admin Dashboard Overview
// This function retrieves an overview of the admin dashboard.
// It counts the total number of users, doctors, clinics, and appointments in the database.
// It returns this data in JSON format.
// If an error occurs during the retrieval, it calls the next middleware with an error handler. 
export const getAdminDashboardOverview = async (req, res, next) => {
  try {
      // Count total users, doctors, clinics, and appointments
      const totalUsers = await User.countDocuments();
      const totalDoctors = await DoctorForm.countDocuments();
      const totalClinics = await Clinic.countDocuments();
      const totalAppointments = await Appointment.countDocuments();  // Assuming you have an Appointment model

      res.status(200).json({
          success: true,
          data: {
              totalUsers,
              totalDoctors,
              totalClinics,
              totalAppointments,
          },
      });
  } catch (error) {
      console.error("Error in getAdminDashboardOverview:", error);
      next(errorHandler(500, "Failed to fetch dashboard overview."));
  }
};



// Admin: Update price by city for a treatment
// This function allows an admin to update the price by city for a specific treatment.
// It expects the treatment ID in the request parameters and the price details in the request body.
// The price details should include an array of objects with city, clinicsCount, doctorsCount,
// and minPrice.
// If the treatment is found and updated successfully, it returns the updated treatment details.
// If the treatment is not found, it returns a 404 error.
export const updateTreatmentCityPricing = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { priceByCity } = req.body; // Expect array of { city, clinicsCount, doctorsCount, minPrice }

    if (!priceByCity || !Array.isArray(priceByCity)) {
      return next(errorHandler(400, "Invalid priceByCity data"));
    }

    const treatment = await Treatment.findOne({ slug });
    if (!treatment) {
      return next(errorHandler(404, "Treatment not found"));
    }

    treatment.priceByCity = priceByCity;
    await treatment.save();

    res.status(200).json({
      success: true,
      message: "Treatment city pricing updated successfully",
      treatment
    });
  } catch (error) {
    console.error("Error updating treatment city pricing:", error);
    next(errorHandler(500, "Failed to update treatment city pricing"));
  }
};



// Update Treatment Sections
export const updateTreatmentSections = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { sections } = req.body;

    if (!Array.isArray(sections) || sections.length === 0) {
      return next(errorHandler(400, "Sections must be a non-empty array."));
    }

    const treatment = await Treatment.findOne({ slug });
    if (!treatment) {
      return next(errorHandler(404, "Treatment not found."));
    }

    treatment.sections = sections;
    await treatment.save();

    res.status(200).json({
      success: true,
      message: "Treatment sections updated successfully",
      treatment,
    });
  } catch (error) {
    console.error("Error updating treatment sections:", error);
    next(errorHandler(500, "Failed to update treatment sections"));
  }
};


// --- Update Treatment IMAGES (Admin) ---
export const updateTreatmentImages = async (req, res, next) => {
  try {
    const { treatmentId } = req.params;
    const { images } = req.body; // array of Firebase URLs

    if (!Array.isArray(images)) {
      return next(errorHandler(400, "images must be an array of URLs"));
    }

    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return next(errorHandler(404, "Treatment not found"));

    // REAPLCE EXISTING IMAGES WITH NEW ONES
    treatment.images = images;
    await treatment.save();

    //Realtime update 
    // IO was attached to index.js via app.set('io', io);
    const io = req.app.get('io');
    if (io && treatment.slug) {
      const room = `treatment:${treatment.slug}`;
      console.log('emit ->', room);
      io.to(room).emit('treatment:imagesUpdated', {
        slug: treatment.slug,
        images: treatment.images,
      });
    }

    res.status(200).json({
      success: true,
      message: "Treatment images updated successfully",
      treatment,
    });
  } catch (error) {
    console.error("Error updating images:", error);
    next(errorHandler(500, "Failed to update treatment images"));
  }
};

// --- Update Treatment BASICS (description, priceRange) ---
export const updateTreatmentBasics = async (req, res, next) => {
  try {
    const { treatmentId } = req.params;
    const { description, priceRange } = req.body;

    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return next(errorHandler(404, "Treatment not found"));

    if (typeof description === "string") treatment.description = description;
    if (typeof priceRange === "string") treatment.priceRange = priceRange;

    await treatment.save();

    res.status(200).json({
      success: true,
      message: "Treatment basics updated successfully",
      treatment,
    });
  } catch (error) {
    console.error("Error updating basics:", error);
    next(errorHandler(500, "Failed to update treatment basics"));
  }
};

// Helper: convert Firebase DOWNLOAD URL -> storage path like "treatments/slug/file.jpg"
function urlToStoragePath(downloadUrl) {
  try {
    // expects: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<ENCODED_PATH>?alt=media&token=...
    const match = downloadUrl.match(/\/o\/(.+?)\?/);
    if (!match || !match[1]) return null;
    return decodeURIComponent(match[1]); // decode "treatments%2Fslug%2Ffilename.jpg"
  } catch {
    return null;
  }
}

// --- Delete specific Treatment IMAGES (Admin) ---
// DELETE one or more images from a treatment
export const deleteTreatmentImages = async (req, res, next) => {
  try {
    const { treatmentId } = req.params;
    const { images } = req.body; // array of URLs to remove

    if (!Array.isArray(images)) {
      return next(errorHandler(400, "images must be an array of URLs"));
    }

    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return next(errorHandler(404, "Treatment not found"));

    // Remove matching URLs
    treatment.images = treatment.images.filter((img) => !images.includes(img));
    await treatment.save();

    // Realtime update
    const io = req.app.get("io");
    if (io && treatment.slug) {
      io.to(`treatment-${treatment.slug}`).emit("treatment:imagesUpdated", {
        slug: treatment.slug,
        images: treatment.images,
      });
    }

    res.status(200).json({
      success: true,
      message: "Image(s) deleted successfully",
      images: treatment.images,
    });
  } catch (err) {
    console.error("Error deleting treatment images:", err);
    next(errorHandler(500, "Failed to delete treatment images"));
  }
};

export const deleteAllTreatmentImages = async (req, res, next) => {
  try {
    const { treatmentId } = req.params;

    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return next(errorHandler(404, "Treatment not found"));

    treatment.images = [];
    await treatment.save();

    const io = req.app.get("io");
    if (io && treatment.slug) {
      io.to(`treatment-${treatment.slug}`).emit("treatment:imagesUpdated", {
        slug: treatment.slug,
        images: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "All images deleted successfully",
      images: [],
    });
  } catch (err) {
    console.error("Error deleting all treatment images:", err);
    next(errorHandler(500, "Failed to delete all treatment images"));
  }
};



// Delete ALL Treatment IMAGES (Admin) ---
export const clearTreatmentImages = async (req, res, next) => {
  try {
    const { treatmentId } = req.params;

    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return next(errorHandler(404, "Treatment not found"));

    const bucket = admin.storage().bucket();
    const urls = treatment.images || [];

    // try deleting all files
    await Promise.all(
      urls.map(async (url) => {
        const filePath = urlToStoragePath(url);
        if (!filePath) return;
        try {
          await bucket.file(filePath).delete({ ignoreNotFound: true });
        } catch (err) {
          console.warn("Storage delete warn:", filePath, err?.message);
        }
      })
    );

    // clear DB
    treatment.images = [];
    await treatment.save();

    const io = req.app.get("io");
    if (io && treatment.slug) {
      const room = `treatment:${treatment.slug}`;
      io.to(room).emit("treatment:imagesUpdated", {
        slug: treatment.slug,
        images: treatment.images,
      });
    }

    res.status(200).json({
      success: true,
      message: "All images cleared successfully",
      images: [],
    });
  } catch (error) {
    console.error("Error clearing treatment images:", error);
    next(errorHandler(500, "Failed to clear treatment images"));
  }
};
  


