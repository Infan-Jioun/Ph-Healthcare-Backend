
import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import { sendResposne } from "../../../shared/sendResponse";


const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const schedule = await scheduleService.createSchedule(payload);
    sendResposne(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await scheduleService.getAllSchedules(query as IQueryParams);
    sendResposne(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: {
            page: result.meta.page,
            limit: result.meta.limit,
            total: result.meta.total,
            totalPage: result.meta.totalPages
        }
    });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedule = await scheduleService.getScheduleById(id as string);
    sendResposne(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
    });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedSchedule = await scheduleService.updateSchedule(id as string, payload);
    sendResposne(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await scheduleService.deleteSchedule(id as string);
    sendResposne(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule deleted successfully',
    });
}
);

export const scheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}
