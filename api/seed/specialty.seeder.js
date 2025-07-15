import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Specialty from "../models/specialty.model.js";
import Doctor from "../models/doctorForm.model.js";

dotenv.config();

// **Step 1: Specialty Mapping (Mapping Doctor's medicalCategory to Specialty Name)**
const specialtyMapping = {
    "Neurology": "Neurologist",
    "Dermatology": "Dermatologist",
    "Gynecology": "Gynecologist",
    "Medical ethicist": "Medical Ethics",
    "Dentistry": "Dentist",
    "Cardiology": "Cardiologist",
    "Ophthalmology": "Ophthalmologist",
    "Nutrition": "Nutritionist",
    "Speech therapy": "Speech Therapist",
    "Orthopedics": "Orthopedic Surgeon",
    "Endocrinology": "Endocrinologist",
    "Oncology": "Oncologist",
    "Allergy and Immunology": "Allergist",
    "Anesthesiology": "Anesthesiologist",
    "Emergency Medicine": "Emergency Medicine Specialist",
    "Family Medicine": "Family Medicine Specialist",
    "Gastroenterology": "Gastroenterologist",
    "General Surgery": "General Surgeon",
    "Hematology": "Hematologist",
    "Internal Medicine": "Internal Medicine Specialist",
    "Nephrology": "Nephrologist",
    "Obstetrics": "Obstetrician",
    "Oral & Maxillofacial Surgery": "Oral & Maxillofacial Surgeon",
    "Orthopedic Surgery": "Orthopedic Surgeon",
    "Otolaryngology (ENT)": "ENT Specialist",
    "Pediatrics": "Pediatrician",
    "Plastic Surgery": "Plastic Surgeon",
    "Psychiatry": "Psychiatrist",
    "Psychology": "Psychologist",
    "Pulmonology": "Pulmonologist",
    "Radiology": "Radiologist",
    "Rheumatology": "Rheumatologist",
    "Sports Medicine": "Sports Medicine Specialist",
    "Urology": "Urologist",
    "Vascular Surgery": "Vascular Surgeon",
    "Chiropractic": "Chiropractor",
    "Dietitian": "Dietitian",
    "Acupuncture": "Acupuncturist",
    "Pathology": "Pathologist",
    "Medical Genetics": "Medical Geneticist"
};

// **Step 2: Specialty Data (List of Specialties and Treatments)**
const specialtyData = [
    { name: "Neurologist", treatments: ["Migraine Treatment", "Stroke Prevention", "Epilepsy Management"] },
    { name: "Dermatologist", treatments: ["Acne Treatment", "Skin Cancer Screening", "Botox & Fillers"] },
    { name: "Gynecologist", treatments: ["Menstrual Disorder Treatment", "PCOS Management", "Pap Smear Testing"] },
    { name: "Medical Ethics", treatments: ["Ethical Consultations", "Bioethics Research"] },
    { name: "Dentist", treatments: ["Teeth Cleaning", "Root Canal Treatment", "Cavity Filling", "Dental Implants"] },
    { name: "Cardiologist", treatments: ["ECG", "Cardiac Stress Test", "Heart Failure Treatment"] },
    { name: "Ophthalmologist", treatments: ["Cataract Surgery", "LASIK Surgery", "Glaucoma Treatment"] },
    { name: "Nutritionist", treatments: ["Weight Loss Counseling", "Meal Planning", "Diabetes Diet Management"] },
    { name: "Speech Therapist", treatments: ["Speech Therapy", "Voice Therapy", "Language Disorder Treatment"] },
    { name: "Orthopedic Surgeon", treatments: ["Joint Replacement", "Sports Injury Treatment"] },
    { name: "Endocrinologist", treatments: ["Diabetes Management", "Thyroid Disorder Treatment"] },
    { name: "Oncologist", treatments: ["Chemotherapy", "Cancer Screening", "Tumor Biopsy"] },
    { name: "Allergist", treatments: ["Allergy Testing", "Immunotherapy", "Autoimmune Disorder Management"] },
    { name: "Anesthesiologist", treatments: ["Pain Management", "Spinal & Epidural Anesthesia"] },
    { name: "Emergency Medicine Specialist", treatments: ["Critical Care", "Trauma Treatment", "Stroke Emergency Care"] },
    { name: "Family Medicine Specialist", treatments: ["Annual Health Check-ups", "Preventive Healthcare"] },
    { name: "Gastroenterologist", treatments: ["Endoscopy", "Liver Disease Management"] },
    { name: "General Surgeon", treatments: ["Appendectomy", "Hernia Repair", "Gallbladder Removal"] },
    { name: "Hematologist", treatments: ["Anemia Treatment", "Blood Clot Treatment"] },
    { name: "Internal Medicine Specialist", treatments: ["Diabetes Management", "Hypertension Treatment"] },
    { name: "Nephrologist", treatments: ["Dialysis Treatment", "Chronic Kidney Disease Management"] },
    { name: "Obstetrician", treatments: ["Prenatal Care", "High-Risk Pregnancy Management"] },
    { name: "Urologist", treatments: ["Kidney Stone Removal", "Prostate Exam"] },
    { name: "Plastic Surgeon", treatments: ["Facelift", "Liposuction", "Scar Removal"] },
    { name: "Radiologist", treatments: ["X-Rays", "MRI & CT Scans"] }
];

// **Step 3: Seeder Function**
const runSeeder = async () => {
    try {
        await connectDB();

        // **Step 4: Delete Old Specialties**
        await Specialty.deleteMany({});

        // **Step 5: Insert New Specialties**
        await Specialty.insertMany(specialtyData);

        // **Step 6: Fetch Doctors**
        const doctors = await Doctor.find();

        if (doctors.length === 0) {
            console.log(" No doctors found. Please add doctors first.");
            return;
        }


        const specialties = await Specialty.find();

        if (specialties.length === 0) {
            console.log(" No specialties found. Please seed specialties first.");
            return;
        }

        // **Step 7: Assign Doctors to Specialties**
        for (const doctor of doctors) {
            const mappedSpecialty = specialtyMapping[doctor.medicalCategory];

            if (!mappedSpecialty) {
                console.warn(` No matching specialty found for doctor ${doctor.firstName} ${doctor.lastName} (${doctor.medicalCategory})`);
                continue;
            }

            const specialty = await Specialty.findOne({ name: mappedSpecialty });
            if (specialty) {
                await Specialty.findByIdAndUpdate(
                    specialty._id,
                    { $addToSet: { doctors: doctor._id } },
                    { new: true }
                );
                console.log(`✅ Assigned ${doctor.firstName} ${doctor.lastName} to ${mappedSpecialty}`);
            } else {
                console.warn(` No specialty found for ${mappedSpecialty}`);
            }
        }

    
    } catch (error) {
        console.error("Error running seeder:", error);
    } finally {
        console.log(" Closing database connection...");
        mongoose.connection.close();
    }
};

// **Run Seeder**
runSeeder()







