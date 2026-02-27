import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../../middleware/validateRequest";
import { SpecialityValidation } from "./speciality.validiation";
const router = Router();
router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(SpecialityValidation.createSpecialityZodSchema),
    SpecialityController.createSpeciality)
router.get("/", SpecialityController.getSpeciality)
router.put("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.updateSpeaciality)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.deleteSpeaciality)
export const SpecialityRouter = router;