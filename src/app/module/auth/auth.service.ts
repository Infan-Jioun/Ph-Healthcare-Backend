
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
import { IChangePassword, ILoginPatient, IRegisterPatiendPayload } from "./auth.interface";


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
    console.log("refresh-token", refreshToken);
    console.log("session-token", sessionToken);
    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true
        }
    })
    if (!isSessionTokenExists) {
        throw new AppError(status.UNAUTHORIZED, "Invaild session user")
    }
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
    if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token")
    }
    // ! new acccess token generate
    const data = verifiedRefreshToken.data as JwtPayload;
    console.log(data);
    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        email: data.email,
        role: data.role,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })
    // ! new refresh token generate
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        email: data.email,
        role: data.role,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })
    const updateSession = await prisma.session.update({

        where: {
            token: sessionToken
        }, data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        newAccessToken,
        newRefreshToken,
        sessionToken: updateSession.token
    }
}
const changePassword = async (payload: IChangePassword, sessionToken: string) => {
    //! session checker 
    const session = await auth.api.getSession({
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    })
    if (!session) {
        throw new AppError(status.UNAUTHORIZED, "Invalid Token")
    }
    const result = await auth.api.changePassword({
        body: {
            currentPassword: payload.currentPassword,
            newPassword: payload.newPassword,
            revokeOtherSessions: true
        },
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }

    })
    const newAccessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    })
    // ! new refresh token generate
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    })
    return {
        ...result,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}
const logoutUser = async (sessionToken: string) => {
    const result = await auth.api.signOut({
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    })
    return result;
}

export const authService = {
    registerPatient,
    loginPatient,
    getMe,
    getNewToken,
    changePassword,
    logoutUser
}