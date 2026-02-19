import express, { Application } from "express";
import { SpecialityRouter } from "./app/module/speciality/speciality.router";
import { authRouter } from "./app/module/auth/auth.router";
import { globalErrorHandlar } from "./middleware/globalHandleError";
import { notFound } from "./middleware/notFound";
import { userRouter } from "./app/module/user/user.router";
import { doctorRouter } from "./app/module/doctor/doctor.router";
import cookieParser from "cookie-parser";
const app: Application = express()
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/specialities", SpecialityRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/doctors", doctorRouter)
app.get('/', (req, res) => {
    res.send("Ph Healthcare successfully running")
});
app.use(globalErrorHandlar)
app.use(notFound)
export default app;