import expres, { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { doctorSchedule } from "./doctorSchedule.controller";
const router = expres.Router();


router.post("/create-my-doctor-schedule",
    checkAuth(Role.DOCTOR),
    doctorSchedule.createMyDoctorSchedule);
router.get("/my-doctor-schedules", checkAuth(Role.DOCTOR),
    doctorSchedule.getMyDoctorSchedules);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    doctorSchedule.getAllDoctorSchedules);
router.get("/:doctorId/schedule/:scheduleId", checkAuth(Role.ADMIN, Role.
    SUPER_ADMIN), doctorSchedule.getDoctorScheduleById);
router.patch("/update-my-doctor-schedule",
    checkAuth(Role.DOCTOR),
    doctorSchedule.updateMyDoctorSchedule);
router.delete("/delete-my-doctor-schedule/:id", checkAuth(Role.DOCTOR),
    doctorSchedule.deleteMyDoctorSchedule);
export const doctorScheduleRouter: Router = router;