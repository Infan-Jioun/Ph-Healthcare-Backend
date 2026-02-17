import express, { Router } from "express";
import { userContoller } from "./user.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";
const router = express.Router();
const createDoctorZodSchema = z.object({
    password: z.string("Password is required").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters "),
    doctor: z.object({
        name: z.string("Name is reuired ").min(5, "Name must be at least 5 charactars ").max(30, "Name must be at least most 30 Characters"),
        email: z.string("Invaild email address"),
        contactNumber: z.string("Contact number is required").min(11, "Contact number must be at least 11 characters ").max(14, "Contact number must be at most 15 characters "),
        registrationNumber: z.string("Registration Number is required"),
        experience: z.int("Experience must be an integer").nonnegative("Experience cannot be nagetive").optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE], "Gender must be either MALE or FEMALE"),
        appointmentFee: z.number("Appointment Fee must be a number").nonnegative("Appointment fee cannnot be neagtive"),
        qualification: z.string("Qualification is required ").min(2, "Qualification must be at least 2 characters ").max(50, "Qualification must be at most 50 Characters"),
        currentWorkingPlace: z.string("Current working place is required").min(2, "Current working place must be ar least 2 chracters"),
        designation: z.string("Designation is required").min(2, "Designation must be at least 2 chracters ").max(50, "Designation must be at most 50 characters")
    }),
    speciality: z.array(z.uuid(), "Speciality must be an array of strnigs ").min(1, "At least one Speciality is required")

})
router.post("/create-doctor", userContoller.createDoctor)
export const userRouter: Router = router;