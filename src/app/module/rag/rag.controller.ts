import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { RAGService } from "./rag.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
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
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "Query is required for RAG retrieval",
        })
    }
    const result = await ragService.generateAnswer(query, limit ?? 5, sourceType, true);
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "RAG query completed successfully",
        data: result
    })
})
export const RAGController = {
    ingestDoctor,
    queryRag

}