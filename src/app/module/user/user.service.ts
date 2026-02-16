
import { Role, Speciality } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
    const specialities: Speciality[] = [];
    for (const specialityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        })
        if (!speciality) {
            throw new Error(`Speciality with id ${specialityId} not found`)
        }
        specialities.push(speciality)
    }
    const doctorExists = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    })
    if (doctorExists) {
        throw new Error("User with this email already exists")
    }
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: Role.DOCTOR,
            name: payload.doctor.name,
            needPasswordChange: true
        }
    })
    try {
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor
                }
            })
            const doctorSpecialityDoctor = specialities.map((speciality) => {
                return {
                    doctorId: doctorData.id,
                    specialityId: speciality.id
                }
            })
            await tx.doctorSpeciality.createMany({
                data: doctorSpecialityDoctor
            })
            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    expreience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            isDeleted: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                    speciality: {
                        select: {
                            speciality: {
                                select: {
                                    title: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            })
            return doctor;

        })
        return result
    } catch (error) {
        console.log("transaction error : ", error);
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
    }
}

export const userService = {
    createDoctor
}