import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { appointmentService } from "./appointment.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interface/requestUserInterface";
import { IBookAppointmentPayload } from "./appointment.interface";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const bookData = appointmentService.bookAppointment(user as IRequestUser, payload as IBookAppointmentPayload);
    sendResposne(res, {
        httpStatusCode: status.CREATED,
        message: "Successfully Created Appointment",
        success: true,
        data: bookData
    })
})
const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    const getMyAllData = appointmentService.getMyAppointments(user as IRequestUser);
    sendResposne(res, {
        httpStatusCode: status.OK,
        message: "Successfully Get All My Appointment",
        success: true,
        data: getMyAllData
    })
})
const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
    const getAllData = appointmentService.getAllAppointments();
    sendResposne(res, {
        httpStatusCode: status.OK,
        message: "Successfully All Appointment",
        success: true,
        data: getAllData
    })
})
const getMySingleAppointment = catchAsync(async (req: Request, res: Response) => {
    const singleData = appointmentService.getMySingleAppointment();
    sendResposne(res, {
        httpStatusCode: status.OK,
        message: "Successfully Get My Single Appointment",
        success: true,
        data: singleData
    })
})
const changeAppointmentStatus = catchAsync(async (req: Request, res: Response) => {
    const changeData = appointmentService.changeAppointmentStatus();
    sendResposne(res, {
        httpStatusCode: status.OK,
        message: "Successfully Change Appointment Status",
        success: true,
        data: changeData
    })
})
export const AppointmentController = {
    bookAppointment,
    getMyAppointments,
    getAllAppointments,
    getMySingleAppointment,
    changeAppointmentStatus


}