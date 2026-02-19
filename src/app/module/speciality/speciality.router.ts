import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
const router = Router();
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.createSpeciality)
router.get("/", SpecialityController.getSpeciality)
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.updateSpeaciality)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.deleteSpeaciality)
export const SpecialityRouter = router;