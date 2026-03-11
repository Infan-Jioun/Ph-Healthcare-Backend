import express, { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { scheduleController } from "./schedule.controller";
import { validateRequest } from "../../../middleware/validateRequest";
import { ScheduleValidation } from "./schedule.validation";
const router = express.Router();
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema), scheduleController.createSchedule)
export const schedule: Router = router;
