import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";

const createMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const doctorSchedule = await doctorScheduleService.createMyDoctorSchedule();
    sendResposne(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Successfully created Doctor Schedule!",
        data: doctorSchedule,

    })
})
export const doctorSchedule = {
    createMyDoctorSchedule
}