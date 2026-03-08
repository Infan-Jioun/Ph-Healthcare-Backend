import { Request, Response } from "express"
import { catchAsync } from "../../../shared/catchAsync"
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { scheduleService } from "./schedule.service";

const createSchedule = catchAsync((req: Request, res: Response) => {
    const schedule = scheduleService.createSchedule();
    sendResposne(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: "Schedule created successfully",
        data: schedule
    })
})
export const scheduleController = {
    createSchedule
}