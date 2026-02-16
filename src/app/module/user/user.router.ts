import express, { Router } from "express";
import { userContoller } from "./user.controller";
const router = express.Router();
router.post("/create-doctor", userContoller.createDoctor)
export const userRouter: Router = router;