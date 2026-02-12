import { Request, Response } from "express";
import { specialityService } from "./speciality.service";

const createSpeciality = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const result = await specialityService.createSpeciality(payload);
        res.status(200).json({
            success: true,
            message: "Speciality Created Successfully ",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Speciality Created Failed",
            error: error instanceof Error ? error.message : "unknown error"
        })

    }
}
export const SpecialityController = {
    createSpeciality
}