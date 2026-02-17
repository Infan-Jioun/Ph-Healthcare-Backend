import express, { Router } from "express";
import { doctorController } from "./doctor.contoller";
const router = express.Router();
router.get("/", doctorController.getAllDoctor)
export const doctorRouter: Router = router