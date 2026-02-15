import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../../shared/catchAsync";
interface IResponseData<T> {
    httpStatusCode: number
    success: boolean
    message: string
    data?: T
}
const sendResposne = <T>(res: Response, responseData: IResponseData<T>) => {
    const { httpStatusCode, message, success, data } = responseData;
    res.status(httpStatusCode).json({
        success,
        message,
        data
    })
}
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
        res.status(200).json({
            success: true,
            message: "Specilaties Fetch Success",
            data: result
        })
    }
)
const updateSpeaciality = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title } = req.body;
        const result = await specialityService.updateSpeaciality(id as string, title as string);
        res.status(200).json({
            success: true,
            message: "Successfully update",
            data: result
        })
    }
)
const deleteSpeaciality = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await specialityService.deleteSpeaciality(id as string);
        res.status(200).json({
            success: true,
            message: "Successfully deleted Speaciality",
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