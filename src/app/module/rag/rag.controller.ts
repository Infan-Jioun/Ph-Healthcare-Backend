import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { RAGService } from "./rag.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { redisService } from "../../lib/redis";
const ragService = new RAGService()
const ingestDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await ragService.ingestDoctorData();
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor data ingested successfully",
        data: result

    })
})
const queryRag = catchAsync(async (req: Request, res: Response) => {
    const { query, limit, sourceType } = req.body;

    if (!query) {
        return sendResposne(res, {
            success: false,
            httpStatusCode: status.BAD_REQUEST,
            message: "Query is required",
        });
    }

    //* Generate cache key from query parameters
    const cacheKey = `rag:query:${query}:${limit ?? 5}:${sourceType || 'all'}`;

    try {
        //*  Try to get from cache first
        const cachedResult = await redisService.get(cacheKey);

        if (cachedResult) {
            //! Cache hit - parse and return cached data
            const parsedData = JSON.parse(cachedResult);

            sendResposne(res, {
                success: true,
                httpStatusCode: status.OK,
                message: "Answer retrieved from cache",
                data: parsedData,
            });
            return;
        }
    } catch (cacheError) {
        // Log cache error but continue with normal processing
        console.warn('Cache read error, proceeding with normal processing:', cacheError);
    }

    //! Cache miss - process normally
    const result = await ragService.generateAnswer(
        query,
        limit ?? 5,
        sourceType,
        true,
    );

    //! Store result in cache with 30-minute TTL (1800 seconds)
    try {
        await redisService.set(cacheKey, result, 1800);
    } catch (cacheError) {
        //* Log cache error but don't fail the request
        console.warn('Cache write error:', cacheError);
    }

    sendResposne(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Answer generated successfully",
        data: result,
    });
});
const getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await ragService.getStats()
    sendResposne(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Rag stats retrieved successfully ",
        data: result
    })
})
export const RAGController = {
    ingestDoctor,
    queryRag,
    getStats

}