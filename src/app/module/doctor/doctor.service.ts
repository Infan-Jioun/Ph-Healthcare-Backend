import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface"

const getAllDoctor = async () => {
    const doctors = await prisma.doctor.findMany({
        // * ekane delete use hoise soft delete korar deka nai jai moto
        where: { isDeleted: false },
        include: {
            user: true,
            speciality: {
                include: {
                    speciality: true
                }
            }
        }

    })
    return doctors

}
const getDoctorById = async (id: string) => {

    const doctor = await prisma.doctor.findFirst({
        where: {
            id,
        },

    })
    return doctor
}
const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {

    const existingData = await prisma.doctor.findUnique({
        where: {
            id
        },
    })
    if (!existingData) {
        throw new Error("Doctor not found")
    }
    const doctor = await prisma.doctor.update({
        where: { id },
        data: payload
    })
    return doctor
}
// *using soft deleted method
const deleteDoctor = async (id: string) => {
    const existingData = await prisma.doctor.findUnique({
        where: { id }
    })
    if (!existingData) {
        throw new Error("Doctor not found")
    }
    const result = await prisma.doctor.update({
        where: { id },
        data: {
            isDeleted: true
        }
    })
    return result
}
export const doctorService = {
    getAllDoctor,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}