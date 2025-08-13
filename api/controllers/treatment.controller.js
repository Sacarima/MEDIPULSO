import Treatment from "../models/treatment.model.js";
import slugify from "slugify";
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

        const slug = slugify(name, { lower: true });

        const treatment = new Treatment({ name, slug, description, specialties });
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

// Get Treatment by Slug
// This function retrieves a treatment by its slug.
// It expects the slug to be provided in the request parameters.
// It populates the specialties field in the Treatment model and returns the treatment details.
// If the treatment is not found, it returns a 404 error.
// If there is an error during the process, it returns a 500 error.
// It also collects doctor IDs from all specialties and fetches their details.
// This is useful for displaying related doctors for the treatment.

export const getTreatmentBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        // Find treatment and populate specialties + doctors
        const treatment = await Treatment.findOne({ slug })
            .populate({
            path: "specialties",
            select: "name doctors",
            populate: {
                path: "doctors",
                select: "firstName lastName profilePicture specialty ratings city"
            }
            })
            .lean();

        if (!treatment) {
            return next(errorHandler(404, "Treatment not found."));
        }

        // Collect all doctors from all specialties
        const allDoctors = treatment.specialties.flatMap(spec => spec.doctors || []);

        // Remove duplicates by ID
        const uniqueDoctors = [];
        const seen = new Set();
        for (const doc of allDoctors) {
            const idStr = doc._id.toString();
            if (!seen.has(idStr)) {
            seen.add(idStr);
            uniqueDoctors.push(doc);
            }
        }

        res.status(200).json({
            success: true,
            treatment,
            doctors: uniqueDoctors // flat array of doctors
        });
        } catch (error) {
        next(errorHandler(500, "Failed to fetch treatment and related doctors."));
        }
};


// Get Treatments List for Homepage
export const getTreatmentsList = async (req, res, next) => {
  try {
    const treatments = await Treatment.find()
      .select("name slug") // only send what's needed for homepage links
      .lean();

    if (!treatments || treatments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No treatments found." });
    }

    res.status(200).json({ success: true, treatments });
  } catch (error) {
    next(errorHandler(500, "Failed to fetch treatments list."));
  }
};


// controllers/treatment.controller.js

// export const updateTreatmentImages = async (req, res) => {
//   try {
//     const { treatmentId } = req.params;
//     const { images = [], mode = 'append' } = req.body;

//     if (!Array.isArray(images) || images.length === 0) {
//       return res.status(400).json({ message: 'Body must include a non-empty array "images".' });
//     }

//     const treatment = await Treatment.findById(treatmentId);
//     if (!treatment) return res.status(404).json({ message: 'Treatment not found' });

//     if (!Array.isArray(treatment.images)) treatment.images = [];

//     if (mode === 'replace') {
//       treatment.images = images;
//     } else if (mode === 'remove') {
//       const toRemove = new Set(images);
//       treatment.images = treatment.images.filter(u => !toRemove.has(u));
//     } else { // append (default)
//       const merged = [...treatment.images, ...images];
//       // de-dup while preserving order
//       const seen = new Set();
//       treatment.images = merged.filter(u => (seen.has(u) ? false : (seen.add(u), true)));
//     }

//     await treatment.save();
//     return res.json({ treatmentId: treatment._id, images: treatment.images });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Failed to update treatment images' });
//   }
// };

export const updateTreatmentImages = async (req, res) => {
  try {
    const { treatmentId } = req.params;
    const { images = [], mode = 'append' } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Body must include a non-empty array "images".' });
    }

    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });

    if (!Array.isArray(treatment.images)) treatment.images = [];

    if (mode === 'replace') {
      treatment.images = images;
    } else if (mode === 'remove') {
      const toRemove = new Set(images);
      treatment.images = treatment.images.filter(u => !toRemove.has(u));
    } else { // append (default)
      const merged = [...treatment.images, ...images];
      const seen = new Set();
      treatment.images = merged.filter(u => (seen.has(u) ? false : (seen.add(u), true)));
    }

    await treatment.save();

    // Emit live update
    const io = req.app.get('io');
    if (io && treatment.slug) {
      const room = `treatment:${treatment.slug}`;
      io.to(room).emit('treatment:imagesUpdated', {
        slug: treatment.slug,
        images: treatment.images,
      });
    }

    return res.json({ treatmentId: treatment._id, images: treatment.images });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update treatment images' });
  }
};

