import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";

const createDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await userService.createDoctor(payload);
        sendResposne(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Doctor Registered Successfully",
            data: result
        })

    }
)
const createAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await userService.createAdmin(payload);
        sendResposne(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Admin Registerd Successfully",
            data: result
        })
    }
)
export const userContoller = {
    createDoctor,
    createAdmin
}