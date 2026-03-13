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