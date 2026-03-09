import { Request, Response } from "express"
import { catchAsync } from "../../../shared/catchAsync"
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { scheduleService } from "./schedule.service";
import { ICreateSchedulePayload } from "./schedule.interface";

const createSchedule = catchAsync((req: Request, res: Response) => {
    const payload = req.body;
    const schedule = scheduleService.createSchedule(payload as ICreateSchedulePayload);
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