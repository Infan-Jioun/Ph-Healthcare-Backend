import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUserInterface";
import AppError from "../../errorHelper/appError";
import { cookieUtils } from "../../utils/cookie";
import { envVars } from "../../../config/env";

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
const verifyEmail = catchAsync(
    async (req: Request, res: Response) => {
        const { otp, email } = req.body;

        const result = await authService.verifyEmail(otp, email);
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Email verified successfully",
            data: result
        })
    }
)
const forgetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await authService.forgetPassword(email as string)
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset OTP send to email successfully",

        })
    }
)
const resetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await authService.resetPassword(email as string, otp as string, newPassword as string)
        sendResposne(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset Successfully",

        })
    }
)
//! /api/v1/auth/login/google
const googleLogin = ((req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";
    const encodedRedirectPath = encodeURIComponent(redirectPath as string);
    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/login/google/success?redirect=${encodedRedirectPath}}`;
    res.render("googleRedirect", {
        callbackURL: callbackURL,
        betterAuthUrl: envVars.BETTER_AUTH_URL 
    })

})
export const authController = {
    registerPatient,
    loginPatient,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    googleLogin
}