import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await authService.registerPatient(payload);
        const { accessToken, refreshToken, token, ...rest } = result;
        tokenUtils.setAccessTokenCookie(res, accessToken)
        tokenUtils.setRefreshTokenCookie(res, refreshToken)
        tokenUtils.setBetterAuthSessionCookie(res, token as string)
        sendResposne(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient Successfully Register",
            data: {
                accessToken,
                refreshToken,
                ...rest
            }
        })
    }
)
const loginPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await authService.loginPatient(payload)
        const { accessToken, refreshToken, token, ...rest } = result;
        tokenUtils.setAccessTokenCookie(res, accessToken)
        tokenUtils.setRefreshTokenCookie(res, refreshToken)
        tokenUtils.setBetterAuthSessionCookie(res, token as string)
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Patient Successfully login",
            data: {
                accessToken,
                refreshToken,
                ...rest
            }
        })
    }
)
export const authController = {
    registerPatient,
    loginPatient
}