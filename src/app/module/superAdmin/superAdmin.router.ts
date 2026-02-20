import express, { Router } from "express";

import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { superAdminContoller } from "./superAdmin.controller";
const router = express.Router();
router.get("/", checkAuth(Role.SUPER_ADMIN), superAdminContoller.getSuperAdmin);
router.get("/:id", checkAuth(Role.SUPER_ADMIN), superAdminContoller.getSuperAdminById);
router.put("/:id", checkAuth(Role.SUPER_ADMIN), superAdminContoller.updateSuperAdmin);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), superAdminContoller.deleteSuperAdmin);
export const superAdminRouter: Router = router; 