import { uuidv7 } from "zod"
import { IRequestUser } from "../../interface/requestUserInterface"
import { prisma } from "../../lib/prisma"
import { IBookAppointmentPayload } from "./appointment.interface"

const bookAppointment = async (user: IRequestUser, payload: IBookAppointmentPayload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    })
    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId,

        }
    })
    const doctorScheduleData = await prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id
            }
        }
    })
    const videoCallingId = String(uuidv7());
    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorScheduleData.scheduleId,
                videoCallingId
            }
        })
        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId
                }
            },
            data: {

                isBooked: true
            }
        });
        return appointmentData
    });
    return result;

}
const getMyAppointments = () => {

}
const changeAppointmentStatus = () => {

}
const getMySingleAppointment = () => {

}
const getAllAppointments = () => {

}
export const appointmentService = {
    bookAppointment,
    getAllAppointments,
    changeAppointmentStatus,
    getMyAppointments,
    getMySingleAppointment
}