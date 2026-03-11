import expres, { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { doctorSchedule } from "./doctorSchedule.controller";
const router = expres.Router();
router.post("/create-my-doctor-schedule", checkAuth(Role.DOCTOR), doctorSchedule.createMyDoctorSchedule)
export const doctorScheduleRouter: Router = router;