import { Prisma } from "../../../generated/prisma/client"

export const scheduleFilterableFields = [
    "id",
    "startDateTime",
    "endDateTime",

]
export const scheduleSearchFields = [
    "id",
    "startDateTime",
    "endDateTime"
]

export const scheduleIncludeConfig: Partial<Record<keyof Prisma.ScheduleInclude, Prisma.ScheduleInclude[keyof Prisma.ScheduleInclude]>> = {
    appointments: {
        include: {
            doctor: true,
            patient: true,
            payment: true,
            prescription: true,
            review: true,
        }
    },
    doctorSchedules: true
}