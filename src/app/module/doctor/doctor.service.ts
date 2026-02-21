import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface"
import AppError from "../../errorHelper/appError"
import status from "http-status"
import { Status } from "../../../generated/prisma/enums"

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
            isDeleted: false
        }, include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }, appointments: {
                include: {
                    patient: true,
                    schedule: true,
                    prescription: true,

                }
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }


            },
            reviews: {
                include: {
                    patient: true
                }
            }

        }

    })
    return doctor
}
const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {

    const existingData = await prisma.doctor.findUnique({
        where: {
            id,
        },
    })
    if (!existingData) {
        throw new AppError(status.NOT_FOUND, "Doctor not found")
    }
    const { doctor: doctorData, specialities } = payload;
    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: { id },
                data: {
                    ...doctorData
                }
            })
        }
        if (specialities && specialities.length > 0) {
            for (const speciality of specialities) {
                const { specialityId, shouldDelete } = speciality;
                if (shouldDelete) {
                    await prisma.doctorSpeciality.deleteMany({
                        where: {

                            doctorId: id,
                            specialityId

                        }
                    })
                } else {
                    await prisma.doctorSpeciality.upsert({
                        where: {
                            doctorId_specialityId: {
                                doctorId: id,
                                specialityId
                            }
                        },
                        create: {
                            doctorId: id,
                            specialityId
                        },
                        update: {}
                    })
                }
            }
        }
    })


    const doctor = await getDoctorById(id)
    return doctor;
}
// *using soft deleted method
const deleteDoctor = async (id: string) => {
    const existingData = await prisma.doctor.findUnique({
        where: { id },
        include: { user: true }
    })
    if (!existingData) {
        throw new AppError(status.NOT_FOUND, "Doctor not found")
    }
    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id },
            data:
            {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
        await tx.user.update({
            where: { id: existingData.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: Status.DELETED
            }
        })
        await tx.session.deleteMany({
            where: {
                userId: existingData.userId
            }

        })
        await tx.doctorSpeciality.deleteMany({
            where: {
                doctorId: id
            }
        })
    })
    return { message: "Doctor deleted successfully" }
}
export const doctorService = {
    getAllDoctor,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}