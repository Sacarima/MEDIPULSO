import { errorHandler } from "../utils/error"

export const getMedicalCategories = async (req, res) => {
    try {
        const medicalCategories = [
            {
                name: "Cardiology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Dermatology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Endocrinology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Gastroenterology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "General Practice",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Geriatrics",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Hematology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Infectious Disease",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Internal Medicine",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Nephrology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Neurology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Obstetrics and Gynecology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Oncology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Ophthalmology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Orthopedics",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Otolaryngology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Pediatrics",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Physical Medicine and Rehabilitation",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Plastic Surgery",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Psychiatry",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Pulmonology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Radiology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Rheumatology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
            {
                name: "Urology",
                locations: ["Krakow", "Wroclaw", "Warsaw", "Poznan", "Online"]
            },
        ]
        res.json(medicalCategories)
    } catch (error) {
        errorHandler(500, 'Failed to get medical categories')
    }
}