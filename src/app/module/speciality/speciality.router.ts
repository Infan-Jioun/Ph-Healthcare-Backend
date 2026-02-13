import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
const router = Router();
router.post("/", SpecialityController.createSpeciality)
router.get("/", SpecialityController.getSpeciality)
router.delete("/:id", SpecialityController.deleteSpeaciality)
export const SpecialityRouter = router;