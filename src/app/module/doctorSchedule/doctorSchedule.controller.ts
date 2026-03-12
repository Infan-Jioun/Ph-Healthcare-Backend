import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import { sendResposne } from "../../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interface/requestUserInterface";
import { ICreateDoctorSchedulePayload, IUpdateDoctorSchedulePayload } from "./doctorSchedule.interface";
import { IQueryParams } from "../../interface/query.interface";

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
const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const query = req.query;
    const getMyDoctor = await doctorScheduleService.getMyDoctorSchedules(user as IRequestUser, query as IQueryParams)
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Successfully Get Doctor Schedule!",
        data: getMyDoctor.data,
        meta: {
            page: getMyDoctor.meta.page,
            limit: getMyDoctor.meta.limit,
            total: getMyDoctor.meta.total,
            totalPage: getMyDoctor.meta.totalPages
        }

    })
})
const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const getAllDoctor = await doctorScheduleService.getAllDoctorSchedules()
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Successfully Get All Doctor Schedule!",
        data: getAllDoctor,

    })
})
const getDoctorScheduleById = catchAsync(async (req: Request, res: Response) => {
    const getDoctorById = await doctorScheduleService.getDoctorScheduleById()
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Successfully Get Doctor By Id Schedule!",
        data: getDoctorById,

    })
})
const updateMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const updateSchedule = await doctorScheduleService.updateMyDoctorSchedule(user as IRequestUser, payload as IUpdateDoctorSchedulePayload);
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Successfully updated Doctor Schedule!",
        data: updateSchedule,
    })
})
const deleteMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const deleteDoctor = await doctorScheduleService.deleteMyDoctorSchedule()
    sendResposne(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Successfully Doctor Schedule Deleted!",
        data: deleteDoctor,

    })
})
export const doctorSchedule = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule
}