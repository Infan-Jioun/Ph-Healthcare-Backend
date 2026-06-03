import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { RAGService } from "./rag.service";
import { sendResposne } from "../../../shared/sendResponse";
const ragService = new RAGService()
const ingestDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await ragService.ingestDoctorData();
    sendResposne(res, {
        httpStatusCode: 200,
        success: true,
        message: "Doctor data ingested successfully",
        data: result

    })
})
export const RAGController = {
    ingestDoctor
}