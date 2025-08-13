import express from "express";
import {
    getTreatments,
    getTreatmentById,
    getTreatmentsBySpecialty,
    addTreatment,
    updateTreatment,
    getTreatmentBySlug,
    getTreatmentsList,
    updateTreatmentImages
} from "../controllers/treatment.controller.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

// Public Routes

// Homepage treatments (light)
router.get("/list", getTreatmentsList);

// All treatments (full data)
router.get("/", getTreatments);
// Single treatment detail by slug

// single treatment detail by slug
router.get("/slug/:slug", getTreatmentBySlug)
router.get("/specialty/:specialtyName", getTreatmentsBySpecialty);
router.get("/:treatmentId", getTreatmentById);

// Admin Routes
router.post("/", verifyAdmin, addTreatment);
router.put("/:treatmentId", verifyAdmin, updateTreatment);
// routes/treatment.routes.js
router.put('/:treatmentId/images', verifyAdmin, updateTreatmentImages);



export default router;
 