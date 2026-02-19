/* eslint-disable @typescript-eslint/no-unused-vars */

import status from "http-status";
import { Role, Speciality } from "../../../generated/prisma/client";
import AppError from "../../errorHelper/appError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdmin, ICreateDoctorPayload, ICreateSuperAdmin } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
    const specialities: Speciality[] = [];
    for (const specialityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        })
        if (!speciality) {
            throw new AppError(status.NOT_FOUND, `Speciality with id ${specialityId} not found`)
        }
        specialities.push(speciality)
    }
    const doctorExists = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    })
    if (doctorExists) {
        throw new AppError(status.CONFLICT, "User with this email already exists")
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
                    experience: true,
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
const createAdmin = async (payload: ICreateAdmin) => {
    // ! user checker
    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.admin.email
        }
    });
    if (userExists) {
        throw new AppError(status.CONFLICT, "User Already exists!")
    }
    // ! Create user with better auth
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            password: payload.password,
            role: Role.ADMIN,
            name: payload.admin.name,
            needPasswordChange: true,
            rememberMe: true
        }
    })

    // !Create admin profile in transaction
    try {
        const result = await prisma.$transaction(async (tx) => {
            // ! Create admin recored
            const admin = await tx.admin.create({
                data: {
                    userId: userData.user.id,
                    name: payload.admin.name,
                    email: payload.admin.email,
                    role: userData.user.role as Role,
                    profilePhoto: payload.admin.profilePhoto,
                    contactNumber: payload.admin.contactNumber
                }
            })
            console.log(admin);
            //! Fetch created admin with user data
            const createAdmin = await tx.admin.findUnique({
                where: {
                    id: admin.id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            status: true
                        }
                    }
                }

            })

            return createAdmin
        })
        return result
    } catch (error) {
        //! Deleted user
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed Deleted")
    }
}

const createSuperAdmin = async (payload: ICreateSuperAdmin) => {
    const userExists = await prisma.user.findFirst({
        where: {
            email: payload.superAdmin.email
        }
    })
    if (userExists) {
        throw new AppError(status.CONFLICT, "User Already exists!")
    }
    // ! create better auth user 
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.superAdmin.email,
            password: payload.password,
            role: Role.SUPER_ADMIN,
            name: payload.superAdmin.name,
            needPasswordChange: true,
            rememberMe: true
        }
    })

    // !Create admin profile in transaction
    try {
        const result = await prisma.$transaction(async (tx) => {
            // ! Create admin recored
            const superAdmin = await tx.superAdmin.create({
                data: {
                    userId: userData.user.id,
                    name: payload.superAdmin.name,
                    email: payload.superAdmin.email,
                    role: userData.user.role as Role,
                    profilePhoto: payload.superAdmin.profilePhoto,
                    contactNumber: payload.superAdmin.contactNumber
                }
            })
            console.log(superAdmin);
            //! Fetch created admin with user data
            const createSuperAdmin = await tx.superAdmin.findUnique({
                where: {
                    id: superAdmin.id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            status: true
                        }
                    }
                }

            })

            return createSuperAdmin
        })
        return result
    } catch (error) {
        //! Deleted user
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed Deleted")
    }

}
export const userService = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}