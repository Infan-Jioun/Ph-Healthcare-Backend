import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interface/requestUserInterface";
import { ICreateDoctorSchedulePayload, IUpdateDoctorSchedulePayload } from "./doctorSchedule.interface";

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
const updateMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const payload = req.body;
    const user = req.user;
    const updateSchedule = await doctorScheduleService.updateMyDoctorSchedule(id as string, user as IRequestUser, payload as IUpdateDoctorSchedulePayload);
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Successfully updated Doctor Schedule!",
        data: updateSchedule,
    })
})
export const doctorSchedule = {
    createMyDoctorSchedule,
    updateMyDoctorSchedule
}