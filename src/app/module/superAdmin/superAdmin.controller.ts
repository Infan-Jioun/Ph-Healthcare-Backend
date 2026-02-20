import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { superAdminService } from "./superAdmin.service";


const getSuperAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const result = await superAdminService.getSuperAdmin();
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Super Admin get Successfully",
            data: result
        })
    }
)
const getSuperAdminById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await superAdminService.getSuperAdminById(id as string);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Super Admin get by id Successfully",
            data: result
        })
    }
)
const updateSuperAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await superAdminService.updateSuperAdmin(id as string, req.body);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Super Admin updated Successfully",
            data: result
        })
    }
)
const deleteSuperAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await superAdminService.deleteSuperAdmin(id as string);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Super Admin deleted Successfully",
            data: result
        })
    }
)

export const superAdminContoller = {
    getSuperAdmin,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
}