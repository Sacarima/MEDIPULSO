// routes/patients.route.js
import express from "express";
import Appointment from "../models/appointment.model.js"; // your appointment schema
import User from "../models/user.model.js"; // your "patients" are just users

const router = express.Router();

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appts = await Appointment.find({ doctor: doctorId })
      .populate("patient", "firstName lastName email phoneNumber avatar createdAt role") // populate from User schema
      .lean();

    const patientsMap = new Map();

    appts.forEach(a => {
      const p = a.patient;
      if (p && p.role === "user") {
        patientsMap.set(p._id.toString(), p);
      }
    });

    const patients = Array.from(patientsMap.values());

    res.json({ patients });
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

export default router;
