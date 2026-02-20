import status from "http-status"
import { prisma } from "../../lib/prisma"
import { IUpdateAdminPayload } from "./admin.interface"
import AppError from "../../errorHelper/appError"

const getAdmin = async () => {
    const admin = await prisma.admin.findMany({
        where: { isDeleted: false },
        include: {
            user: true
        }

    })
    return admin
}
const getAdminById = async (id: string) => {
    const admin = await prisma.admin.findFirst({
        where: {
            id: id
        }
    })
    return admin;
}
const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
    const existingData = await prisma.admin.findUnique({
        where: {
            id, email: payload.admin.email
        }
    })
    if (!existingData) {
        throw new AppError(status.NOT_FOUND, "Admin not found")
    }
    const admin = await prisma.admin.update({
        where: { id },
        data: {
            ...payload.admin
        }
    })
    return admin;
}
const deleteAdmin = async (id: string) => {
    const existingData = await prisma.admin.findUnique({
        where: { id },
    })
    if (!existingData) {
        throw new AppError(status.NOT_FOUND, "Admin not found")
    }
    const result = await prisma.admin.delete({
        where: { id }
    })
    return result;
}
export const adminService = {
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
}
