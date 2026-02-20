import status from "http-status"
import { prisma } from "../../lib/prisma"
import AppError from "../../errorHelper/appError"
import { IUpdateSuperAdminPayload } from "./superAdmin.interface"

const getSuperAdmin = async () => {
    const superAdmin = await prisma.superAdmin.findMany({
        where: { isDeleted: false },
        include: {
            user: true
        }

    })
    return superAdmin
}
const getSuperAdminById = async (id: string) => {
    const superAdmin = await prisma.superAdmin.findFirst({

        where: {
            id: id
        }
    })
    return superAdmin;
}
const updateSuperAdmin = async (id: string, payload: IUpdateSuperAdminPayload) => {
    const existingData = await prisma.superAdmin.findUnique({
        where: {
            id,
            email: payload.superAdmin.email
        }
    })
    if (!existingData) {
        throw new AppError(status.NOT_FOUND, "Super Admin not found")
    }
    const superAdmin = await prisma.superAdmin.update({
        where: { id },
        data: {
            ...payload.superAdmin
        }
    })
    return superAdmin;
}
const deleteSuperAdmin = async (id: string) => {
    const existingData = await prisma.superAdmin.findUnique({
        where: { id },
    })
    if (!existingData) {
        throw new AppError(status.NOT_FOUND, "Super Admin not found")
    }
    const result = await prisma.superAdmin.delete({
        where: { id }
    })
    return result;
}
export const superAdminService = {
    getSuperAdmin,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
}
