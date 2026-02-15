import { NextFunction, Request, RequestHandler, Response } from "express";
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
//* async function 
const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Speciality fetch failed ",
                error: error instanceof Error ? error.message : "unknown error "
            })
        }
    }
}
const getSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const result = await specialityService.getSpeciality();
        res.status(200).json({
            success: true,
            message: "Specilaties Fetch Success",
            data: result
        })
    }
)
const updateSpeaciality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const result = await specialityService.updateSpeaciality(id as string, title as string);
        res.status(200).json({
            success: true,
            message: "successfully  update",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "update failed",
            error: error instanceof Error ? error.message : "unknown error"
        })
    }
}
const deleteSpeaciality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await specialityService.deleteSpeaciality(id as string);
        res.status(200).json({
            success: true,
            message: "Successfully deleted Speaciality",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Deleted failed",
            error: error instanceof Error ? error.message : "unknown error"
        })
    }
}
export const SpecialityController = {
    createSpeciality,
    getSpeciality,
    deleteSpeaciality,
    updateSpeaciality
}