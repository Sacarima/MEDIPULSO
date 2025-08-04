import DoctorForm from '../models/doctorForm.model.js'
import DoctorAvailability from '../models/doctorAvailability.model.js'
import { errorHandler } from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import admin from 'firebase-admin'


export const test = (req, res) => {
    res.json({message: 'API is working'})

}

// Update Doctor Profile
// This function updates the doctor's profile information.
export const updateDoctor = async (req, res, next) => {

    // Ensure doctor is updating their own profile
    if (req.user.id !== req.params.doctorId) {
        return next(errorHandler(403, 'You are not authorized to perform this action'));
    }

    // Password validation & hashing
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters long'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    try {
        const updatedDoctor = await DoctorForm.findByIdAndUpdate(
            req.params.doctorId, 
            {
                $set: {
                    email: req.body.email,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber,
                    city: req.body.city,
                    countryCode: req.body.countryCode,
                    medicalCategory: req.body.medicalCategory,
                    termsConditions: req.body.termsConditions,
                    profileStatistics: req.body.profileStatistics,
                    location: req.body.location,
                    address: req.body.address,
                    experience: req.body.experience,
                    underSpecialization: req.body.underSpecialization,
                    diseases: req.body.diseases,
                    scopeOfAdvice: req.body.scopeOfAdvice,
                    consultationFee: req.body.consultationFee,
                    consultationType: req.body.consultationType,
                    consultationMedium: req.body.consultationMedium,
                    availability: req.body.availability,
                    publications: req.body.publications,
                    awards: req.body.awards,
                    education: req.body.education,
                    specializations: req.body.specializations,
                    languages: req.body.languages,
                    photo: req.body.photo,
                    photoURLs: req.body.photoURLs,
                    profileStatistics: req.body.profileStatistics,
                    profilePicture: req.body.profilePicture,
                    certificate: req.body.certificate,
                    aboutMe: req.body.aboutMe,
                    facebook: req.body.facebook,
                    instagram: req.body.instagram,
                    twitter: req.body.twitter,
                    linkedin: req.body.linkedin,
                    youtube: req.body.youtube,
                    selectedDiseases: req.body.selectedDiseases,
                    workExperience: req.body.workExperience,
                    video: req.body.video,
                    degree: req.body.degree,
                    doctorSpecialization: req.body.doctorSpecialization,
                    medicalSpecialtyCategory: req.body.medicalSpecialtyCategory,
                    gender: req.body.gender,
                    license: req.body.license,
                    medicalSpecialtyForAdvice: req.body.medicalSpecialtyForAdvice,
                    heardAboutUs: req.body.heardAboutUs,
                    officeName: req.body.officeName,
                    officeAddress: req.body.officeAddress,
                    onlineConsultation: req.body.onlineConsultation,
                    acceptChildren: req.body.acceptChildren,
                    publication: req.body.publication,
                    awards: req.body.awards,
                    customTreatments: req.body.customTreatments,

                },
            },
            { new: true }
        );

        if (!updatedDoctor) {
            return next(errorHandler(404, 'Doctor profile not found'));
        }

        // Remove password before sending response
        const { password, ...rest } = updatedDoctor._doc;

        res.status(200).json(rest);
    } catch (error) {
        console.error(' Failed to update doctor information:', error);
        next(errorHandler(500, 'Failed to update doctor information'));
    }
};





// Update Doctor Profile Completion
// This function updates the doctor's profile completion status.
// It checks if the user is authorized to update the profile and if the doctor exists in the database.
// If the doctor is found, it updates the profile with the provided data and returns the updated profile.
// If any errors occur, it handles them appropriately and returns an error response.
export const updateDoctorProfileCompletion = async (req, res, next) => {

    if (!req.user || !req.user._id) {
        return next(errorHandler(401, "Unauthorized - Invalid user data"));
    }

    if (!req.params.doctorId) {
        return next(errorHandler(400, "Doctor ID is required"));
    }

    if (req.user._id !== req.params.doctorId) {
        console.log(" Doctor ID mismatch - Access Denied");
        return next(errorHandler(403, "You are not authorized to perform this action"));
    }

    try {
        const doctor = await DoctorForm.findById(req.params.doctorId);
        if (!doctor) {
            console.log(" Doctor profile not found in Data Base");
            return next(errorHandler(404, "Doctor profile not found"));
        }

        const updatedDoctor = await DoctorForm.findByIdAndUpdate(
            req.params.doctorId,
            { $set: req.body },
            { new: true }
        );

        console.log("✅ Profile Updated Successfully:", updatedDoctor);

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            doctor: updatedDoctor,
        });
    } catch (error) {
        console.error(" Failed to update doctor profile completion:", error);
        next(errorHandler(500, "Failed to update doctor profile completion"));
    }
};

// Get Doctor by ID
// This function retrieves a doctor's information by their ID.
// It checks if the doctor exists and returns their details excluding sensitive information like password.
export const getDoctor = async (req, res, next) => {
    try {
        const doctor = await DoctorForm.findById(req.params.id)

        if(!doctor) return next(errorHandler(404, "Doctor not found!"))
        
        const { password: pass, ...rest } = doctor._doc

        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
} 
  
// Get recently added doctors with pagination
// This function retrieves the most recently added doctors, sorted by creation date, with pagination support.
// It allows clients to fetch a specific page of results, with a default limit of 10
// doctors per page. The response includes the list of doctors, total number of pages, current page, and total number of doctors.
// It also selects specific fields to return in the response, excluding sensitive information like passwords.
export const getRecentlyAddedDoctors = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = 10;  // Number of doctors per page
        const skip = (page - 1) * limit;

        const doctors = await DoctorForm.find()
            .sort({ createdAt: -1 })  // Sort by most recent
            .skip(skip)
            .limit(limit)
            .select('firstName lastName profilePicture city medicalCategory');  // Adjust as needed

        const totalDoctors = await DoctorForm.countDocuments();  // Total doctors count for pagination

        res.status(200).json({
            success: true,
            data: {
                doctors,
                totalPages: Math.ceil(totalDoctors / limit),
                currentPage: page,
                totalDoctors,
            },
        });
    } catch (error) {
        console.error('Error fetching recently added doctors:', error);
        next(errorHandler(500, "Failed to fetch recently added doctors."));
    }
};




// Get Doctor's Public Profile
// This function retrieves a doctor's public profile based on their first name, last name, medical category, and city.
// It uses regular expressions to perform case-insensitive matching for each parameter.
// If the doctor is found, it returns their profile information; otherwise, it returns a 404 error.
// The function also handles any errors that may occur during the database query.
// This is useful for displaying a doctor's public profile on the frontend without exposing sensitive information like password
export const getDoctorPublicProfile = async (req, res) => {
    try {
        console.log("Received params:", req.params)
        const { firstName, lastName, medicalCategory, city } = req.params
        const doctor = await DoctorForm.findOne({
            firstName: new RegExp(`^${firstName}$`, 'i'), 
            lastName: new RegExp(`^${lastName}$`, 'i'),
            medicalCategory: new RegExp(`^${medicalCategory}$`, 'i'),
            city: new RegExp(`^${city}$`, 'i'),
            officeAddress: new RegExp(`^${req.params.officeAddress}$`, 'i'),
            officeName: new RegExp(`^${req.params.officeName}$`, 'i'),
            phoneNumber: new RegExp(`^${req.params.phoneNumber}$`, 'i'),
            photo: new RegExp(`^${req.params.photo}$`, 'i'),   
            
        })

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" })
        }
        res.json(doctor)
    } catch (error) {
        console.error('Error fetching doctor profile:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// get doctor public profile information excluding password
// This function retrieves a doctor's public profile information by their ID.
// It uses the DoctorForm model to find the doctor by ID and selects all fields except the password.
// If the doctor is found, it returns their profile information; otherwise, it returns a 404 error.
// The function also handles any errors that may occur during the database query.
// This is useful for displaying a doctor's public profile on the frontend without exposing sensitive information like password
export const getDoctorPublicProfileInfo = async (req, res) => {
    try {
        const doctor = await DoctorForm.findById(req.params.doctorId).select('-password')
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" })
        }
        res.json(doctor)
    } catch (error) {
        console.error('Error fetching doctor profile:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Get doctor's treatment
// This function retrieves a doctor's treatments by their ID.
// It populates the doctor's specialty and combines the specialty's treatments with the doctor's custom treatments.
// If the doctor is found, it returns their name, specialty, and treatments; otherwise,
// it returns a 404 error.
// The function also handles any errors that may occur during the database query.
export const getDoctorTreatments = async (req, res, next ) => {
    try {
        const doctor = await DoctorForm.findById(req.params.doctorId).populate("specialty")

        if (!doctor) return next(errorHandler(404, "Doctor not found."))

        res.status(200).json({
            doctor: doctor.name,
            specialty: doctor.specialty.name,
            treatments: [...doctor.specialty.treatments, ...doctor.customTreatments]
        })
    } catch (error) {
        next(errorHandler(500, "Failed to fetch doctor's treatments."))
    }
}

// Update Doctor's custom Treatment
// This function updates a doctor's custom treatments by their ID.
// It expects the request body to contain an array of custom treatments.
// If the doctor is found, it updates their custom treatments and returns a success message;
// otherwise, it returns a 404 error.
// The function also handles any errors that may occur during the database update.
export const updateDoctorTreatments = async (req, res, next) => {
    try {
      const { customTreatments } = req.body
  
      const doctor = await DoctorForm.findByIdAndUpdate(
        req.params.doctorId,
        { customTreatments },
        { new: true }
      )
      
      if (!doctor) return next(errorHandler(404, "Doctor not found."))
      
      res.status(200).json({ message: "Treatments updated successfully.", doctor })
    } catch (error) {
      next(errorHandler(500, "Failed to update treatments."))
    }
  }

// Search Doctors
// This function searches for doctors based on various criteria such as specialty, location, online consultation availability,
// and availability on a specific date. It constructs a dynamic query based on the provided parameters and fetches matching doctors from the database.
// If no doctors are found, it returns a 404 error;
// otherwise, it returns the list of doctors that match the search criteria.
// It also handles errors that may occur during the search process.
// The function logs the search criteria and any errors encountered during the process for debugging purposes.
// This is useful for allowing users to find doctors based on their specific needs and preferences.
export const searchDoctors = async (req, res, next) => {
    try {
        const { specialty, location, onlineConsultation, availability } = req.query;

        if (!specialty && !location && onlineConsultation === undefined && !availability) {
            return next(errorHandler(400, 'Please provide at least a location, specialty, online consultation filter, or availability filter.'));
        }

        // Create a dynamic query object
        let searchQuery = {};
        if (specialty) searchQuery.medicalCategory = specialty;
        if (location) searchQuery.city = location;
        if (onlineConsultation !== undefined) searchQuery.onlineConsultation = onlineConsultation === "true";

        //  Fetch matching doctors from DoctorForm
        let doctors = await DoctorForm.find(searchQuery).select(
            'firstName lastName medicalCategory gender medicalSpecialtyCategory officeInformation city profilePicture priceList location address zipcode paymentMethods onlineConsultation languages instagram acceptChildren'
        );

        if (!doctors.length) {
            return res.status(404).json({ success: false, message: "No doctors found for the selected criteria." });
        }

        //  Apply availability filter if provided
        if (availability) {

            // Convert the date to ISO format
            const formattedDate = new Date(availability).toISOString().split("T")[0];


            // Find available doctors from DoctorAvailability
            const availableDoctors = await DoctorAvailability.find({
                "monthlyAvailability.dates.date": new Date(formattedDate) // Ensure proper date format
            }).select("doctor");

            console.log(" Doctors available on this date:", availableDoctors.map(doc => doc.doctor));

            if (!availableDoctors.length) {
                return res.status(404).json({ success: false, message: "No doctors found with the selected availability." });
            }

            //Filter doctors who match availability
            const availableDoctorIds = availableDoctors.map((doc) => doc.doctor.toString());
            doctors = doctors.filter((doctor) => availableDoctorIds.includes(doctor._id.toString()));

            if (!doctors.length) {
                return res.status(404).json({ success: false, message: "No doctors found with the selected availability." });
            }
        }

        res.status(200).json({ success: true, doctors, });

    } catch (error) {
        console.error(" Error searching for doctors:", error);
        next(errorHandler(500, "Failed to fetch doctors."));
    }
};

// Get Random Doctors
// This function retrieves 6 random doctors from the database, along with their latest review.
// It uses MongoDB's aggregation framework to sample random doctors, look up their reviews, and
// sort them by the most recent review. The result includes the doctor's basic information and their latest review details.
// If an error occurs during the process, it handles the error and returns a 500 status with an error message.
// This is useful for displaying a selection of doctors on the frontend, such
export const getRandomDoctors = async (req, res, next) => {
    try {
      // Fetch 6 random doctors
      const randomDoctors = await DoctorForm.aggregate([
        { $sample: { size: 6 } },  // Get 6 random doctors
        {
          $lookup: {
            from: 'reviews',  // Reference the reviews collection
            localField: '_id',  // Match doctor ID
            foreignField: 'doctor',  // Match doctor in reviews
            as: 'reviews'  // Name the field to store reviews
          }
        },
        {
          $unwind: {
            path: '$reviews',  // Unwind the reviews array (this ensures only one review is shown)
            preserveNullAndEmptyArrays: true  // Keep doctors with no reviews
          }
        },
        {
          $sort: {
            'reviews.createdAt': -1  // Sort by most recent review
          }
        },
        {
          $group: {
            _id: '$_id',  // Group by doctor ID
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            profilePicture: { $first: '$profilePicture' },
            city: { $first: '$city' },
            medicalCategory: { $first: '$medicalCategory' },
            latestReview: { $first: '$reviews' },  // Get the latest review
          }
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            city: 1,
            medicalCategory: 1,
            latestReview: {
              comment: 1,
              rating: 1,
              user: 1,  // Include the user that gave the review
            }
          }
        }
      ]);
  
      res.status(200).json({
        success: true,
        doctors: randomDoctors,
      });
    } catch (err) {
      console.error("Error fetching random doctors:", err);
      next(errorHandler(500, 'Failed to fetch random doctors.'));
    }
  }

  export async function deleteDoctorPhoto(req, res, next) {
      try {
    const filePath = decodeURIComponent(req.params.filePath);
    const bucket = admin.storage().bucket();
    await bucket.file(filePath).delete();
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete photo' });
    next(errorHandler(500, 'Failed to delete photo'));
  }
 }
  