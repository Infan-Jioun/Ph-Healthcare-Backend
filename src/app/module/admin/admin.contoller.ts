import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { adminService } from "./admin.service";

const getAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminService.getAdmin();
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin get Successfully",
            data: result
        })
    }
)
const getAdminById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await adminService.getAdminById(id as string);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin get by id Successfully",
            data: result
        })
    }
)

export const adminContoller = {
    getAdmin,
    getAdminById
}