
import status from "http-status";
import { Status } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/appError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUserInterface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

interface IRegisterPatiendPayload {
    name: string,
    email: string,
    password: string
}

const registerPatient = async (payload: IRegisterPatiendPayload) => {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({

        body: {
            name, email, password
        }
    })
    if (!data.user) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed To register patiend")
    }
    //TODO const patient = await prisma.$transaction(async (tx) => {
    try {
        const patient = await prisma.$transaction(async (tx) => {
            const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email

                }
            })
            return patientTx
        })
        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        })
        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerfied: data.user.emailVerified
        })

        return {
            ...data,
            accessToken,
            refreshToken,
            patient
        }
    } catch (error) {
        console.log("Transaction error", error);
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw error;
    }
}
interface ILoginPatient {
    email: string
    password: string
}
const loginPatient = async (payload: ILoginPatient) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email, password
        }
    })
    if (!data.user) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "You are not Patient")
    }
    if (data.user.status === Status.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Patient is Blooked")
    }
    if (data.user.isDeleted || data.user.status === Status.DELETED) {
        throw new AppError(status.NOT_FOUND, "Patient is Deleted")
    }
    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })
    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerfied: data.user.emailVerified
    })
    return {
        ...data,
        accessToken,
        refreshToken
    }
}
const getMe = async (user: IRequestUser) => {
    const existingUser = await prisma.user.findUnique({
        where: { id: user.userId },
        include: {
            patient: {
                include: {
                    appointments: true,
                    medicalReports: true,
                    reviews: true,
                    prescriptions: true,
                    patientHealthData: true
                }
            },
            doctor: {
                include: {
                    appointments: true,
                    doctorSchedules: true,
                    speciality: true,
                    reviews: true,

                },

            },
            admin: true,
            superAdmin: true
        }
    })
    if (!existingUser) {
        throw new AppError(status.NOT_FOUND, "User Not found")
    }
    return existingUser;
}
const getNewToken = async (refreshToken: string, sessionToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
    if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token")
    }
    // ! new acccess token generate
    const data = verifiedRefreshToken.data as JwtPayload;
    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })
    // ! new refresh token generate
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerfied: data.user.emailVerified
    })
    return {
        newAccessToken,
        newRefreshToken
    }
}
export const authService = {
    registerPatient,
    loginPatient,
    getMe
}