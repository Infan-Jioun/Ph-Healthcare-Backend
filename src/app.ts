import express, { Application } from "express";
import { SpecialityRouter } from "./app/module/speciality/speciality.router";
import { authRouter } from "./app/module/auth/auth.router";
import { globalErrorHandlar } from "./middleware/globalHandleError";
import { notFound } from "./middleware/notFound";
import { userRouter } from "./app/module/user/user.router";
import { doctorRouter } from "./app/module/doctor/doctor.router";
import cookieParser from "cookie-parser";
import { adminRouter } from "./app/module/admin/admin.router";
import { superAdminRouter } from "./app/module/superAdmin/superAdmin.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors"
import { envVars } from "./config/env";
const app: Application = express()
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [envVars.FRONTEND_URL || "http://localhost:3000", envVars.BETTER_AUTH_URL || "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["content-type", "Authorization"]
}))
app.set("view engine", "ejs")
app.set("views", path.resolve(process.cwd(), `src/app/templates`))
app.use("/api/auth", toNodeHandler(auth))
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/specialities", SpecialityRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/superAdmin", superAdminRouter)
app.use("/api/v1/doctors", doctorRouter)
app.get('/', (req, res) => {
    res.send("Ph Healthcare successfully running")
});
app.use(globalErrorHandlar)
app.use(notFound)
export default app;