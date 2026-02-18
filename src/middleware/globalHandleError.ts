/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import z from "zod";
import status from "http-status";
import { TErrorResponce, TErrorSource } from "../app/interface/error.interface";
import { handelZodError } from "../app/errorHelper/handelZodError";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandlar = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error from global error Handler", err);
    }
    let errorSource: TErrorSource[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error ";
    if (err instanceof z.ZodError) {
        const simplifiedError = handelZodError(err);
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;
        errorSource = [...(simplifiedError.errorSource ?? [])]
    }
    const errorResponse: TErrorResponce = {
        success: false,
        message: message,
        errorSource,
        error: envVars.NODE_ENV === "development" ? err : undefined
    }
    res.status(statusCode).json(errorResponse)

}

