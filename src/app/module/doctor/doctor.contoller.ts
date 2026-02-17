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
const updateDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await doctorService.updateDoctor(id as string, req.body);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Successfully Update",
            data: result
        })


    }
)
const deleteDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await doctorService.deleteDoctor(id as string, );
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Successfully Deleted Doctor",
            data: result
        })


    }
)
export const doctorController = {
    getAllDoctor,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}