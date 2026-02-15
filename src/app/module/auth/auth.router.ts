import express, { Router } from "express";
import { authController } from "./auth.controller";
const router = express.Router();

router.post("/register", authController.registerPatient)
router.post("/login", authController.loginPatient)
export const authRouter: Router = router;  