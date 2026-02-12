import express, { Router } from "express";
import { SpecialityRouter } from "../module/speciality/speciality.router";
const router = express.Router()
router.post("/specialities", SpecialityRouter)
export const indexRoutes: Router = router;