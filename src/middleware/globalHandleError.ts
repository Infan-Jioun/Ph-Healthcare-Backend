/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

export const globalErrorHandlar = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error from global error Handler", err);
    }
    const statusCode: number = 500;
    const message: string = "Internal server error ";
    res.status(statusCode).json({
        success: false,
        message: message,
        error: err.message
    })
}
