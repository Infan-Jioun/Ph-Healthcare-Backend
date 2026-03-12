import { Prisma } from "../../../generated/prisma/client"


export const doctorScheduleSearchFilterAbleField = [
    "id",
    "doctorId",
    "scheduleId"
]
export const doctorScheduleFilterAbleFileds = [
    "id",
    "doctorId",
    "scheduleId",
    "createdId",
    "updatedId",
    "isBooked",
    "schedule.startDateTime",
    "schedule.endDateTime"
]

export const doctorScheduleIncludeConfig: Partial<Record<keyof Prisma.DoctorSchedulesInclude, Prisma.DoctorSchedulesInclude[
    keyof Prisma.DoctorSchedulesInclude
]>> = {
    doctor: {
        include: {
            user: true,
            appointments: true,
            specialities: true,
        }
    },
    schedule: true
}