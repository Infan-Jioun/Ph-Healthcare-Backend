import { Gender } from "../../../generated/prisma/enums"

export interface ICreateDoctorPayload {
    password: string
    doctor: {
        name: string
        email: string
        profilePhoto: string
        contactNumber: string
        address: string
        registrationNumber: string
        experience: number
        gender: Gender
        appointmentFee: number
        qualification: string
        currentWorkingPlace: string
        designation: string
    }
    specialities: string[]
}
// Add this interface to user.interface.ts

export interface ICreateAdmin {
    password: string;
    admin: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber: string;
    };
}
export interface ICreateSuperAdmin {
    password: string;
    superAdmin: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber: string;
    };
}