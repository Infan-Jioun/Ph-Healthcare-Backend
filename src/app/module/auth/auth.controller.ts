import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";

const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await authService.registerPatient(payload);
        sendResposne(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient Successfully Register",
            data: result
        })
    }
)
const loginPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await authService.loginPatient(payload)
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Patient Successfully login",
            data: result
        })
    }
)
export const authController = {
    registerPatient,
    loginPatient
}