import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { adminService } from "./admin.service";
import { IRequestUser } from "../../interface/requestUserInterface";


declare module "express-serve-static-core" {
    interface Request {
        user?: IRequestUser;
    }
}

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
const updateAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await adminService.updateAdmin(id as string, req.body);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin updated Successfully",
            data: result
        })
    }
)
const deleteAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await adminService.deleteAdmin(id as string, req.user as IRequestUser);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin deleted Successfully",
            data: result
        })
    }
)

export const adminContoller = {
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
}