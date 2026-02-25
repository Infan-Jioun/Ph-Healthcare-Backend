import express, { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
const router = express.Router();

router.post("/register", authController.registerPatient)
router.post("/login", authController.loginPatient)
router.get("/me", checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT), authController.getMe)
router.post("/refresh-token", authController.getNewToken)
router.post("/change-password", checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT), authController.changePassword)
router.post("/logout", checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT), authController.logoutUser)
router.post("/verify-email", authController.verifyEmail)
router.post("/forget-password", authController.forgetPassword)
router.post("/reset-password", authController.resetPassword)
router.get("/login/google", authController.googleLogin)
router.get("/google/success", authController.googleLoginSuccess)
router.get("/oauth/error", authController.handelAuthError)
export const authRouter: Router = router;  