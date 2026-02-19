import express, { Router } from "express";
import { userContoller } from "./user.controller";
import { validateRequest } from "../../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";
const router = express.Router();

router.post("/create-doctor",
    validateRequest(createDoctorZodSchema)
    //     (req: Request, res: Response, next: NextFunction) => {
    //     const parsedResult = createDoctorZodSchema.safeParse(req.body);
    //     if (!parsedResult.success) {
    //         next(parsedResult.error)
    //     }
    //     // *sanitizing the data
    //     req.body = parsedResult.data;
    //     next();
    // }, 
    , userContoller.createDoctor);
router.post("/create-admin", userContoller.createAdmin)
export const userRouter: Router = router;