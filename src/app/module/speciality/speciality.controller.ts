import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResposne } from "../../../shared/sendResponse";

const createSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await specialityService.createSpeciality(payload);
        sendResposne(res, {
            httpStatusCode: 201,
            success: true,
            message: "Successfully Created Speacilatics",
            data: result
        })
    }
)

const getSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const result = await specialityService.getSpeciality();
        sendResposne(res, {
            httpStatusCode: 201,
            success: true,
            message: "Successfully Fetch Speacilatics",
            data: result
        })
    }
)
const updateSpeaciality = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title } = req.body;
        const result = await specialityService.updateSpeaciality(id as string, title as string);
        sendResposne(res, {
            httpStatusCode: 201,
            success: true,
            message: "Successfully Speacilatics Update",
            data: result
        })
    }
)
const deleteSpeaciality = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await specialityService.deleteSpeaciality(id as string);
        sendResposne(res, {
            httpStatusCode: 201,
            success: true,
            message: "Successfully Deleted Speacilatics",
            data: result
        })
    }
)
export const SpecialityController = {
    createSpeciality,
    getSpeciality,
    deleteSpeaciality,
    updateSpeaciality
}