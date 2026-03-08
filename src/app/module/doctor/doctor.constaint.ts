import { Prisma } from "../../../generated/prisma/browser";

export const doctorSearchAbleFields = ["name", "email", "qualification", "designation", "currentWorkingPlace", "registrationNumber", "specialities.speciality.title"];
export const doctorFilterAbleFields = ["gernder", "isDeleted", "appointmentFee", "experience", "registrationNumber", "specialities.specialityId", "currentWorkingPlace", "designation", "qulification", "specialities.speciality.title", "user.role"]
export const doctorIncludeConfig: Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    speciality: {
        include: {
            speciality: true
        }
    },
    appointments: {
        include: {
            patient: true,
            doctor: true,
            prescription: true
        }
    },
    doctorSchedules: {
        include: {
            schedule: true
        }
    },
    prescriptions: true,
    reviews: true
}