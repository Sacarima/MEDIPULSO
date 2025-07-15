import Treatment from "../models/treatment.model.js";
import { errorHandler } from "../utils/error.js";

// Get All Treatments
// This function retrieves all treatments from the database.
// It populates the specialties field in the Treatment model and returns the list of treatments.
// If no treatments are found, it returns a 404 error.
// If there is an error during the process, it returns a 500 error.
export const getTreatments = async (req, res, next) => {
    try {
        const treatments = await Treatment.find().populate("specialties", "name");
        if (!treatments || treatments.length === 0) {
            return res.status(404).json({ success: false, message: "No treatments found." });
        }

        res.status(200).json({ success: true, treatments });
    } catch (error) {
        next(errorHandler(500, "Failed to fetch treatments."));
    }
};

//  Get a Single Treatment by ID
// This function retrieves a specific treatment by its ID.
// It expects the treatment ID to be provided in the request parameters.    
// It populates the specialties field in the Treatment model and returns the treatment details.
// If the treatment is not found, it returns a 404 error.
// If there is an error during the process, it returns a 500 error.
export const getTreatmentById = async (req, res, next) => {
    try {
        const treatment = await Treatment.findById(req.params.treatmentId).populate("specialties", "name");
        if (!treatment) return next(errorHandler(404, "Treatment not found."));

        res.status(200).json({ success: true, treatment });
    } catch (error) {
        next(errorHandler(500, "Failed to fetch treatment details."));
    }
};

// Get Treatments by Specialty
// This function retrieves all treatments associated with a specific specialty.
// It expects the specialty name to be provided in the request parameters.
// It populates the specialties field in the Treatment model and filters treatments based on the specialty name 
export const getTreatmentsBySpecialty = async (req, res, next) => {
    try {
        const specialtyName = req.params.specialtyName;
        const treatments = await Treatment.find().populate({
            path: "specialties",
            match: { name: specialtyName }, // Filter by specialty name
        });

        const filteredTreatments = treatments
            .filter((treatment) => treatment.specialties.some((s) => s !== null))
            .map((treatment) => treatment.name);

        if (filteredTreatments.length === 0) {
            return res.status(404).json({ success: false, message: "No treatments found for this specialty." });
        }

        res.status(200).json({ success: true, treatments: filteredTreatments });
    } catch (error) {
        next(errorHandler(500, "Failed to fetch treatments for specialty."));
    }
};

//  Add New Treatment (Admin Only)
// This function allows an admin to add a new treatment.
// It checks if the treatment name is provided, creates a new treatment with the provided name,
// description, and specialties, and saves it to the database.
// If the treatment is successfully added, it returns a success message and the treatment details.
// If there is an error during the process, it returns a 500 error.
// If the treatment name is not provided, it returns a 400 error.
export const addTreatment = async (req, res, next) => {
    try {
        const { name, description, specialties } = req.body;

        if (!name) return next(errorHandler(400, "Treatment name is required."));

        const treatment = new Treatment({ name, description, specialties });
        await treatment.save();

        res.status(201).json({ success: true, message: "Treatment added successfully.", treatment });
    } catch (error) {
        next(errorHandler(500, "Failed to add treatment."));
    }
};

// Update Treatment (Admin Only)
// This function allows an admin to update an existing treatment.
// It checks if the treatment ID is valid, updates the treatment with the provided name, description, and specialties,
// and returns the updated treatment details.
// If the treatment is not found, it returns a 404 error.
// If there is an error during the update process, it returns a 500 error.
export const updateTreatment = async (req, res, next) => {
    try {
        const { name, description, specialties } = req.body;

        const treatment = await Treatment.findByIdAndUpdate(
            req.params.treatmentId,
            { name, description, specialties },
            { new: true }
        );
        if (!treatment) return next(errorHandler(404, "Treatment not found."));

        res.status(200).json({ success: true, message: "Treatment updated successfully.", treatment });
    } catch (error) {
        next(errorHandler(500, "Failed to update treatment."));
    }
};
