import status from "http-status"
import { prisma } from "../../lib/prisma"
import { IUpdateAdminPayload } from "./admin.interface"
import AppError from "../../errorHelper/appError"
import { Status } from "../../../generated/prisma/enums"
import { IRequestUser } from "../../interface/requestUserInterface"

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
const deleteAdmin = async (id: string, user: IRequestUser) => {
  

    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id,
        }
    })

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
    }

    if (isAdminExist.id === user.userId) {
        throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.admin.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })

        await tx.user.update({
            where: { id: isAdminExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: Status.DELETED // Optional: you may also want to block the user
            },
        })

        await tx.session.deleteMany({
            where: { userId: isAdminExist.userId }
        })

        await tx.account.deleteMany({
            where: { userId: isAdminExist.userId }
        })

        const admin = await getAdminById(id);

        return admin;
    }
    )

    return result;
}
export const adminService = {
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
}
