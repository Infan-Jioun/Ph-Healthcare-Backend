import express from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { AppointmentController } from "./appointment.controller";
const router = express.Router();
router.post("/book-appointment", checkAuth(Role.PATIENT), AppointmentController.
    bookAppointment);
router.get("/my-appointments", checkAuth(Role.PATIENT, Role.DOCTOR),
    AppointmentController.getMyAppointments);
router.patch("/change-appointment-status/:id", checkAuth(Role.PATIENT, Role.
    DOCTOR, Role.ADMIN, Role.SUPER_ADMIN), AppointmentController.
    changeAppointmentStatus);
router.get("/my-single-appointment/:id", checkAuth(Role.PATIENT, Role.DOCTOR),
    AppointmentController.getMySingleAppointment);
router.get("/all-appointments", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    AppointmentController.getAllAppointments);
export const appointmentRouter: Router = router;