import { NextFunction, Request, RequestHandler, Response } from "express"

//* async function 
export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Speciality fetch failed ",
                error: error instanceof Error ? error.message : "unknown error "
            })
        }
    }
}