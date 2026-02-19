import { NextFunction, Request, Response } from "express";
import { Role, Status } from "../generated/prisma/enums";
import { cookieUtils } from "../app/utils/cookie";
import AppError from "../app/errorHelper/appError";
import status from "http-status";
import { prisma } from "../app/lib/prisma";

export const checkAuth = (...authRols: Role) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // * userChecker  or session checker
        const sessionToken = cookieUtils.getCookie(req, "better-auth-session_token");
        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorzied access! No session token provided")
        }
        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            })
            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;
                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt)
                const createdAt = new Date(sessionExists.createdAt)
                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaning = expiresAt.getTime() - now.getTime();
                const percentRemaning = (timeRemaning / sessionLifeTime) * 100;
                if (percentRemaning < 20) {
                    res.setHeader("X-Session-Refresh", "true");
                    res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                    res.setHeader("X-Time-Remaining", timeRemaning.toString())
                    console.log("Session Expiring soon!!");
                }
                if (user.status === Status.BLOCKED || user.status === Status.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorzied access! User is not active")
                }
                if (user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorzied access! User is deleted")
                }
            }
        }
    } catch (error) {
        next(error)
    }
} 