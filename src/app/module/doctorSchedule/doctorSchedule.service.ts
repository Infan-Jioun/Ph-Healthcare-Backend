import { IRequestUser } from "../../interface/requestUserInterface"
import { prisma } from "../../lib/prisma"
import { ICreateDoctorSchedulePayload, IUpdateDoctorSchedulePayload } from "./doctorSchedule.interface"

const createMyDoctorSchedule = async (user: IRequestUser, payload: ICreateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const doctorScheduleData = await payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId
    }))
    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })
    return result
}
const updateMyDoctorSchedule = async (id: string, user: IRequestUser, payload: IUpdateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const deletedId = payload.scheduleIds.filter(schedule => schedule.shouldDelete).map(schedule => schedule.id)
    const createIds = payload.scheduleIds.filter(schedule => schedule.shouldDelete).map(schedule => schedule.id)
    await prisma.$transaction(async (tx) => {
        await tx.doctorSchedules.deleteMany({
            where: {
                doctorId: doctorData.id,
                scheduleId: {
                    in: deletedId
                }
            }
        })
        const doctorScheduleData = createIds.map((scheduleId) => ({
            doctorId: doctorData.id,
            scheduleId
        }))
        const result = await tx.doctorSchedules.createMany({
            data: doctorScheduleData
        })
        return result
    })

}
export const doctorScheduleService = {
    createMyDoctorSchedule,
    updateMyDoctorSchedule
}