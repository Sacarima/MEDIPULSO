// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import slugify from "slugify";


// import connectDB from "../config/db.js";
// import Specialty from "../models/specialty.model.js";
// import Doctor from "../models/doctorForm.model.js";
// import Treatment from "../models/treatment.model.js";



// import { treatmentDetailData } from "./treatmentDetailData.js";
// import { specialtyData } from "./specialtyData.js";
// import { specialtyMapping } from "./specialtyMapping.js";


// dotenv.config();

// // **Step 3: Seeder Function**
// const runSeeder = async () => {
//     try {
//         await connectDB();

//         //  clear old Specialties anf treatments
//         await Specialty.deleteMany({});
//         await Treatment.deleteMany({});

//         // Insert New Specialties**
//         await Specialty.insertMany(
//             specialtyData.map((specialty) => ({ name: specialty.name, treatments: [] }))
//         );

//         //

//         // Link Doctors to specialties
//         const doctors = await Doctor.find();
//         for (const doctor of doctors) {
//             const mappedSpecialtyName = specialtyMapping[doctor.medicalCategory];
//             if (!mappedSpecialtyName) {
//                 console.warn(`No matching specialty for doctor ${doctor.firstName} ${doctor.lastName} (${doctor.medicalCategory})`);
//                 continue;
//             }
//             const specialty = await Specialty.findOne({ name: mappedSpecialtyName });
//             if (specialty && !specialty.doctors.includes(doctor._id)) {
//                 specialty.doctors.push(doctor._id);
//                 await specialty.save();
//                 console.log(`Linked doctor ${doctor.firstName} ${doctor.lastName} to ${mappedSpecialtyName}`);
//             }
//         }


//         // Insert Treatments and Link to Specialties
//            for (const specialtyEntry of specialtyData) {
//             const { name: specialtyName, treatments } = specialtyEntry;
//             const specialty = await Specialty.findOne({ name: specialtyName });
//             if (!specialty) continue;

//             const uniqueTreatments = [...new Set(treatments.map(t => t.trim()))];

//             for (const treatmentName of uniqueTreatments) {
//                 const slug = slugify(treatmentName, { lower: true });
//                 const extraDetails = treatmentDetailData?.find(
//                 t => t.name.toLowerCase() === treatmentName.toLowerCase()
//                 );

//                 const newTreatment = new Treatment({
//                 name: treatmentName,
//                 slug,
//                 specialties: [specialty._id],
//                 description: extraDetails?.description || "",
//                 images: extraDetails?.images || [],
//                 priceRange: extraDetails?.priceRange || "",
//                 sections: extraDetails?.sections || [],
//                 });

//                 await newTreatment.save();
//                 specialty.treatments.push(newTreatment._id);
//                 console.log(`Seeded treatment: ${treatmentName} (${specialtyName})`);
//             }

//             await specialty.save();
//             }

//             console.log("Seeder completed successfully.");
//          } catch (error) {
//             console.error(" Error running seeder:", error);
//         } finally {
//             mongoose.connection.close();
//             console.log("🔌 MongoDB disconnected!");
//     }
// };

// // **Run Seeder**
// runSeeder()



import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";

import connectDB from "../config/db.js";
import Specialty from "../models/specialty.model.js";
import Treatment from "../models/treatment.model.js";
import Doctor from "../models/doctorForm.model.js";

import { specialtyMapping } from "./specialtyMapping.js";
import { specialtyData } from "./specialtyDataFull.js";
import { treatmentDetailData } from "./treatmentDetailData.js"; 

dotenv.config();

const runSeeder = async () => {
  try {
    await connectDB();

    // 1 Ensure all specialties exist
    for (const specialtyEntry of specialtyData) {
      const existingSpecialty = await Specialty.findOne({ name: specialtyEntry.name });
      if (!existingSpecialty) {
        await Specialty.create({ name: specialtyEntry.name, treatments: [] });
        console.log(` Created specialty: ${specialtyEntry.name}`);
      }
    }

    // 2️ Link Doctors to Specialties
    //  Link Doctors to Specialties (Auto-create if missing)
    let linkedCount = 0;
    let skippedCount = 0;

    const doctors = await Doctor.find();

    for (const doctor of doctors) {
    const normalizedCategory = doctor.medicalCategory?.trim().toLowerCase() || "";

    // Find mapped specialty name (case-insensitive) from mapping keys or values
    let mappedSpecialtyName = null;
    for (const [key, value] of Object.entries(specialtyMapping)) {
        if (
        key.toLowerCase() === normalizedCategory ||
        value.toLowerCase() === normalizedCategory
        ) {
        mappedSpecialtyName = value; // Always use mapping value as the final specialty name
        break;
        }
    }

    // If still no mapping, just capitalize & use the category directly
    if (!mappedSpecialtyName && doctor.medicalCategory) {
        mappedSpecialtyName = doctor.medicalCategory.trim();
    }

    if (!mappedSpecialtyName) {
        console.warn(
        `  No valid specialty for doctor ${doctor.firstName} ${doctor.lastName} (${doctor.medicalCategory})`
        );
        skippedCount++;
        continue;
    }

    // Ensure specialty exists in DB (create if missing)
    let specialty = await Specialty.findOne({ name: mappedSpecialtyName });
    if (!specialty) {
        specialty = new Specialty({ name: mappedSpecialtyName, treatments: [], doctors: [] });
        await specialty.save();
        console.log(` Created specialty: ${mappedSpecialtyName}`);
    }

    // Link doctor to specialty if not already linked
    if (!specialty.doctors.includes(doctor._id)) {
        specialty.doctors.push(doctor._id);
        await specialty.save();
        linkedCount++;
        console.log(` Linked doctor ${doctor.firstName} ${doctor.lastName} to ${mappedSpecialtyName}`);
    }
    }

    console.log(`\nDoctor Linking Summary: ${linkedCount} linked, ${skippedCount} skipped\n`);




    //  Add new treatments without removing existing ones
    for (const specialtyEntry of specialtyData) {
      const { name: specialtyName, treatments } = specialtyEntry;
      const specialty = await Specialty.findOne({ name: specialtyName });
      if (!specialty) continue;

      const uniqueTreatments = [...new Set(treatments.map(t => t.trim()))];

      for (const treatmentName of uniqueTreatments) {
        let treatment = await Treatment.findOne({ name: treatmentName });

        if (!treatment) {
          // Create new treatment
          const slug = slugify(treatmentName, { lower: true });
          const extraDetails = treatmentDetailData?.find(
            t => t.name.toLowerCase() === treatmentName.toLowerCase()
          );

          treatment = new Treatment({
            name: treatmentName,
            slug,
            specialties: [specialty._id],
            description: extraDetails?.description || "",
            images: extraDetails?.images || [],
            priceRange: extraDetails?.priceRange || "",
            sections: extraDetails?.sections || [],
          });

          await treatment.save();
          console.log(` Added treatment: ${treatmentName}`);
        }

        // Link treatment to specialty if not already linked
        if (!specialty.treatments.includes(treatment._id)) {
          specialty.treatments.push(treatment._id);
          await specialty.save();
          console.log(`🔗 Linked ${treatmentName} to ${specialtyName}`);
        }

        // Link specialty to treatment if not already linked
        if (!treatment.specialties.includes(specialty._id)) {
          treatment.specialties.push(specialty._id);
          await treatment.save();
        }
      }
    }

    console.log(" Seeding completed without deleting existing data.");
  } catch (error) {
    console.error(" Error running seeder:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB disconnected!");
  }
};

runSeeder();




