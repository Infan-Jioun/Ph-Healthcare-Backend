import { prisma } from "../../lib/prisma"

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
    return admin
}
export const adminService = {
    getAdmin,
    getAdminById
}
