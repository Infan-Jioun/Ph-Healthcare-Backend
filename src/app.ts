import express, { Application } from "express";
import { SpecialityRouter } from "./app/module/speciality/speciality.router";

const app: Application = express()
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1/specialities", SpecialityRouter)
app.get('/', (req, res) => {
    res.send("Ph Healthcare successfully running")
});
export default app;