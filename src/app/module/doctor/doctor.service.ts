import { prisma } from "../../lib/prisma"

const getAllDoctor = async () => {
    const doctors = await prisma.doctor.findMany({
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
        }

    })
    return doctor
}
export const doctorService = {
    getAllDoctor,
    getDoctorById
}