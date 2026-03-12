import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interface/requestUserInterface";
import { ICreateDoctorSchedulePayload } from "./doctorSchedule.interface";

const createMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body
    const doctorSchedule = await doctorScheduleService.createMyDoctorSchedule(req.user as IRequestUser, payload as ICreateDoctorSchedulePayload);
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