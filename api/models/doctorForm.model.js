import mongoose from "mongoose"

const doctorFormSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
      photo: {
        type: String,

        },
    experience: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    diseases: {
        type: [String],
        required: false,
    },
    disease: {
        type: String,
        required: false,
    },
    medicalSpecialtyCategory: {
        type: String,
        required: false,
    },
    medicalSpecialtyForAdvice: {
        type: String,
        required: false,
    },
    
    medicalCategory: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    termsConditions: {
        type: Boolean,
        required: false,
    },
    profileStatistcs: {
        type: Boolean,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    license: {
        type: String,
        required: false,
    },
    underSpecialization: {
        type: Boolean,
        required: false ,
    },
    video: {
        type: String,
        required: false,
    },
    certificate: {
        type: String,
        required: false,
    },
    aboutMe: {
        type: String,
        required: false,
    },
    facebook: {
        type: String,
        required: false,
    },
    instagram: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },
    linkedin: {
        type: String,
        required: false,
    },
    youtube: {
        type: String,
        required: false,
    },
    selectedDiseases: {
        type: [String],
        required: false,
    },
    scopeOfAdvice: {
        type: String,
        required: false,
    },
    languages: {
        type: String,
        required: false,
    },
    education: {
        type: String,
        required: false,
    },
    ratings: {
        type: String,
        required: false,
    },
    awards: {
        type: String,
        required: false,
    },
    workExperience: {
        type: String,
        required: false,
    },
    consultationFee: {
        type: Number,
        required: false,
    },
    consultationType: {
        type: String,
        required: false,
    },
    consultationTime: {
        type: String,
        required: false,
    },
    consultationDays: {
        type: String,
        required: false,
    },
    consultationHours: {
        type: String,
        required: false,
    },
    consultationTimeZone: {
        type: String,
        required: false,
    },
    consultationLanguage: {
        type: String,
        required: false,
    },
    degree: {
        type: String,
        required: false,
    },
    publication: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['user', 'doctor', 'clinic'],
        required: true,
        default: 'doctor',
    },
    isLicenseVerified: {
        type: Boolean,
        default: false,
    },
    doctorSpecialization: {
        type: String,
        required: false,
    },
    selectAll: {
        type: Boolean, 
        required: false,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },

    // add more fields as needed

}, {timestamps: true}) // this will add createdAt and updatedAt fields))

// Create the model from the schema and export it
const DoctorForm = mongoose.model('DoctorForm', doctorFormSchema)

export default DoctorForm