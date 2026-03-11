import expres, { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
const router = expres.Router();
router.post("/create-my-doctor-schedule", checkAuth(Role.DOCTOR))
export const doctorScheduleRouter: Router = router;