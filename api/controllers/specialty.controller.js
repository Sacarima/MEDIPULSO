import Specialty from "../models/specialty.model.js"
import { errorHandler } from "../utils/error.js"


// Get all Specialties
// This function retrieves all specialties from the database, populating the doctors field with their first and last names.
// If no specialties are found, it returns a 404 error.
// If an error occurs during the retrieval, it returns a 500 error.
// It logs the process of fetching specialties for debugging purposes.
export const getSpecialties = async (req, res, next) => {
    try {
        console.log("Fetching specialties from database...");

        const specialties = await Specialty.find().populate('doctors', 'firstName lastName');

        if (!specialties || specialties.length === 0) {
            return res.status(404).json({ success: false, message: "No specialties found." });
        }

        res.status(200).json({ success: true, specialties });
    } catch (error) {
        console.error("Error fetching specialties:", error);
        next(errorHandler(500, 'Failed to fetch specialties'));
    }
};


// Get a single Specialty
// This function retrieves a specific specialty by its ID.
// It populates the doctors field with their names.
// If the specialty is not found, it returns a 404 error.
// If an error occurs during the retrieval, it returns a 500 error.
// It logs the process of fetching specialty details for debugging purposes.
export const getSpecialtyById = async (req, res, next) => {
    try {
        const specialty = await Specialty.findById(req.params.specialtyId).populate('doctors', 'name') 
        if (!specialty) return next(errorHandler(500, "Failed to fetch specialty details."))
        
        res.status(200).json({message: "Specialty added successfully.", specialty })
    } catch (error) {
        next(errorHandler(500, "Failed to fetch specialty details."))
    }
}

//Add New Specialty (Admin Only) 
// This function allows an admin to add a new specialty.
// It checks if the name and treatments are provided in the request body.
// If they are not provided, it returns a 400 error.
// If the specialty is successfully added, it returns a success message and the specialty details.
// If there is an error during the process, it returns a 500 error.
export const addSpecialty = async (req, res, next) => {
    try {
      const { name, treatments } = req.body;
      if (!name || !treatments) return next(errorHandler(400, "Name and treatments are required."));
  
      const specialty = new Specialty({ name, treatments });
      await specialty.save();
  
      res.status(201).json({ message: "Specialty added successfully.", specialty });
    } catch (error) {
      next(errorHandler(500, "Failed to add specialty."));
    }
  };

// Update Specialty (Admin only)
// This function allows an admin to update an existing specialty.
// It checks if the specialty ID is valid and if the name and treatments are provided in the request body.
// If the specialty is not found, it returns a 404 error.
// If the update is successful, it returns a success message and the updated specialty details.
// If there is an error during the update process, it returns a 500 error.
export const updateSpecialty = async (req, res, next) => {
    try {
        const { name, treatments } = req.body

        const specialty = await Specialty.findByIdAndUpdate(req.params.specialtyId, {name, treatments }, { new: true})
        if (!specialty) return next(errorHandler(404, "Specialty not found."))

        res.status(200).json({ message: "Specialty updated successfully.", specialty })
    } catch (error) {
        next(errorHandler(500, "Failed to update specialty."))
    }
}

// Get Treatments by Specialty
// This function retrieves all treatments associated with a specific specialty.
// It expects the specialty name to be provided in the request parameters.
// It uses a case-insensitive search to find the specialty by name.
// If the specialty is found, it returns the treatments associated with that specialty.
// If no specialty is found, it returns a 404 error.
// If the specialty is found but has no treatments, it returns a 404 error.
// If the treatments are successfully retrieved, it returns them in the response.
// It logs the process of searching for treatments under the specified specialty for debugging purposes.
export const getTreatmentsBySpecialty = async (req, res, next) => {
    try {
        const { medicalCategory } = req.params;

       // Use case-insensitive search
       const specialty = await Specialty.findOne({ name: { $regex: new RegExp(`^${medicalCategory}$`, "i") } });

        if (!specialty) {
            return res.status(404).json({ success: false, message: "Specialty not found." });
        }

        if (!specialty.treatments || specialty.treatments.length === 0) {
            return res.status(404).json({ success: false, message: "No treatments found for this specialty." });
        }

        res.status(200).json({ success: true, treatments: specialty.treatments });
    } catch (error) {
        console.error("Error fetching treatments:", error);
        next(errorHandler(500, "Failed to fetch treatments."));
    }
};
