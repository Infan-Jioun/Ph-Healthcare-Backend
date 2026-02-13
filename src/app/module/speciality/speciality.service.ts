import { Speciality } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
    const speciality = await prisma.speciality.create({
        data: payload
    })
    return speciality
}
const getSpeciality = async (): Promise<Speciality[]> => {
    const speciality = await prisma.speciality.findMany();
    return speciality
}
const updateSpeaciality = async (id: string, title: string): Promise<Speciality> => {
    const speciality = await prisma.speciality.update({
        where: { id },
        data: {
            title
        }
    })
    return speciality;
}
const deleteSpeaciality = async (id: string): Promise<Speciality> => {
    const speciality = await prisma.speciality.delete({
        where: { id }
    })
    return speciality;
}
export const specialityService = {
    createSpeciality,
    getSpeciality,
    deleteSpeaciality,
    updateSpeaciality
}