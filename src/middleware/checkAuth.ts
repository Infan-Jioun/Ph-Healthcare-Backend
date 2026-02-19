import { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/enums";
import { cookieUtils } from "../app/utils/cookie";
import AppError from "../app/errorHelper/appError";
import status from "http-status";

export const checkAuth = (...authRols: Role) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // * userChecker  or session checker
        const sessionToken = cookieUtils.getCookie(req, "better-auth-session_token");
        if (!sessionToken) {
            throw new AppError(status.NOT_FOUND, "Unauthorzied access! No session token provided")
        }
    } catch (error) {
        next(error)
    }
} 