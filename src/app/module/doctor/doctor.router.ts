import express, { Router } from "express";
import { doctorController } from "./doctor.contoller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
const router = express.Router();
router.get("/",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.getAllDoctor)
router.get("/:id", checkAuth(Role.DOCTOR , Role.ADMIN, Role.SUPER_ADMIN), doctorController.getDoctorById)
router.put("/:id" , checkAuth(Role.DOCTOR , Role.ADMIN, Role.SUPER_ADMIN), doctorController.updateDoctor)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorController.deleteDoctor)
export const doctorRouter: Router = router