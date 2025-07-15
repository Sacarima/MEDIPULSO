import express from "express";
import {
    getTreatments,
    getTreatmentById,
    getTreatmentsBySpecialty,
    addTreatment,
    updateTreatment,
} from "../controllers/treatment.controller.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

// Public Routes
router.get("/", getTreatments);
router.get("/:treatmentId", getTreatmentById);
router.get("/specialty/:specialtyName", getTreatmentsBySpecialty);

// Admin Routes
router.post("/", verifyAdmin, addTreatment);
router.put("/:treatmentId", verifyAdmin, updateTreatment);

export default router;
