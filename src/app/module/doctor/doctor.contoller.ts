import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";

const getAllDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const result = await doctorService.getAllDoctor();
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Successfully fetch all doctors",
            data: result
        })


    }
)
const getDoctorById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await doctorService.getDoctorById(id as string);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Successfully fetch Get By id doctor",
            data: result
        })


    }
)
export const doctorController = {
    getAllDoctor,
    getDoctorById
}