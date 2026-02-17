import express, { Router } from "express";
import { doctorController } from "./doctor.contoller";
const router = express.Router();
router.get("/", doctorController.getAllDoctor)
router.get("/:id", doctorController.getDoctorById)
export const doctorRouter: Router = router