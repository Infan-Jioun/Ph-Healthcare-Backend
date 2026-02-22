import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUserInterface";
import AppError from "../../errorHelper/appError";
import { cookieUtils } from "../../utils/cookie";

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
const getMe = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const result = await authService.getMe(user as IRequestUser);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Patient Successfully Fetched",
            data: result
        })
    }
)
const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth-session_token"];
        if (!refreshToken) {
            throw new AppError(status.UNAUTHORIZED, "Refesh is missing");

        }
        const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);
        const { newAccessToken, newRefreshToken, sessionToken } = result;
        tokenUtils.setAccessTokenCookie(res, newAccessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New token genarated successfully",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                sessionToken
            }
        })
    }
)
const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth-session_token"];
        if (!betterAuthSessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Better auth session token is missing");
        }
        const result = await authService.changePassword(payload, betterAuthSessionToken);
        const { accessToken, refreshToken, token } = result;
        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string)
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result
        })
    })
const logoutUser = catchAsync(
    async (req: Request, res: Response) => {
        const betterAuthSessionToken = req.cookies["better-auth-session_token"];
        const result = await authService.logoutUser(betterAuthSessionToken)
        cookieUtils.clearCookie(res, "accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",

        })
        cookieUtils.clearCookie(res, "refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        cookieUtils.clearCookie(res, "better-auth-session_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Logout successfully",
            data: result
        })
    }

)
export const authController = {
    registerPatient,
    loginPatient,
    getMe,
    getNewToken,
    changePassword,
    logoutUser
}