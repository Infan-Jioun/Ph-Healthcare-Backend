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
export const doctorService = {
    getAllDoctor
}