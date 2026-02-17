import express, { Router } from "express";
import { doctorController } from "./doctor.contoller";
const router = express.Router();
router.get("/", doctorController.getAllDoctor)
router.get("/:id", doctorController.getDoctorById)
router.put("/:id", doctorController.updateDoctor)
router.delete("/:id", doctorController.deleteDoctor)
export const doctorRouter: Router = router