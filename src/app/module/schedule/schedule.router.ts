import express, { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { scheduleController } from "./schedule.controller";
const router = express.Router();
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), scheduleController.createSchedule)
export const schedule: Router = router;
